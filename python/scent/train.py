"""Training loop.

Two things here are load-bearing beyond "make the loss go down":

  * The metric is per-label AUROC, macro-averaged over labels that clear a
 support threshold, and the threshold is reported alongside the number.
    A macro-AUROC quoted without saying which labels were counted is not a
    number, it is a decision hidden inside a number.

  * `--audit-stereo` measures the enantiomer blind spot explicitly instead of
    leaving it as a caveat in prose.

Nothing here has been run. See ../README.md.
"""

from __future__ import annotations

import argparse
import json
import logging
from pathlib import Path

import numpy as np
import torch
from sklearn.metrics import average_precision_score, roc_auc_score
from torch_geometric.loader import DataLoader

from .data import load_gslf, stratified_split
from .featurize import enantiomer_pairs, featurize_all
from .model import FocalLoss, ScentNet

log = logging.getLogger(__name__)
RUNS = Path(__file__).resolve().parent.parent / "runs"

# Labels below this many positives in the *evaluation* split get excluded from
# the macro average. AUROC on 2 positives is noise, and averaging it in makes
# the headline number swing by several points between seeds.
EVAL_MIN_POSITIVES = 5


def evaluate(model, loader, device) -> dict:
    model.eval()
    logits, targets = [], []
    with torch.no_grad():
        for batch in loader:
            batch = batch.to(device)
            logits.append(model(batch).cpu())
            targets.append(batch.y.cpu())

    y_score = torch.cat(logits).numpy()
    y_true = torch.cat(targets).numpy()

    per_label_auroc, per_label_ap, counted = [], [], []
    for j in range(y_true.shape[1]):
        pos = int(y_true[:, j].sum())
        if pos < EVAL_MIN_POSITIVES or pos == len(y_true):
            continue
        per_label_auroc.append(roc_auc_score(y_true[:, j], y_score[:, j]))
        per_label_ap.append(average_precision_score(y_true[:, j], y_score[:, j]))
        counted.append(j)

    return {
        "macro_auroc": float(np.mean(per_label_auroc)) if per_label_auroc else float("nan"),
        "macro_ap": float(np.mean(per_label_ap)) if per_label_ap else float("nan"),
        "labels_counted": len(counted),
        "labels_total": int(y_true.shape[1]),
        "per_label_auroc": per_label_auroc,
        "counted_idx": counted,
    }


def audit_stereo(model, dataset, device, use_chirality: bool) -> dict:
    """How far apart does the embedding put mirror-image molecules?

    Carvone is the headline case: one enantiomer is spearmint, the other is
    caraway. If mean pair distance sits near zero the model is blind to
    handedness, which is the expected result for a 2D graph and worth
    publishing rather than burying.
    """
    pairs = enantiomer_pairs(dataset.smiles)
    if not pairs:
        return {"pairs": 0}

    graphs, kept = featurize_all(dataset.smiles, dataset.labels, use_chirality=use_chirality)
    pos_of = {orig: k for k, orig in enumerate(kept)}

    model.eval()
    loader = DataLoader(graphs, batch_size=128, shuffle=False)
    embs = []
    with torch.no_grad():
        for batch in loader:
            embs.append(model.embed(batch.to(device)).cpu())
    E = torch.cat(embs)

    dists = []
    for a, b in pairs:
        if a in pos_of and b in pos_of:
            dists.append(float(1.0 - torch.dot(E[pos_of[a]], E[pos_of[b]])))

    if not dists:
        return {"pairs": 0}

    # Baseline: distance between random pairs, for scale.
    g = torch.Generator().manual_seed(0)
    ridx = torch.randint(0, E.size(0), (2, 2000), generator=g)
    rand = (1.0 - (E[ridx[0]] * E[ridx[1]]).sum(dim=1)).mean().item()

    return {
        "pairs": len(dists),
        "mean_enantiomer_distance": float(np.mean(dists)),
        "mean_random_distance": float(rand),
        "ratio": float(np.mean(dists) / rand) if rand else float("nan"),
        "chirality_tags": use_chirality,
    }


def train(args) -> None:
    device = torch.device(
        args.device or ("cuda" if torch.cuda.is_available() else "cpu")
    )
    log.info("device: %s", device)

    dataset = load_gslf()
    log.info(dataset.describe())

    graphs, kept = featurize_all(
        dataset.smiles,
        dataset.labels,
        use_chirality=not args.no_chirality,
        use_global=not args.no_global,
    )
    log.info("featurised %d/%d molecules", len(graphs), len(dataset))

    labels_kept = dataset.labels[kept]
    train_i, val_i, test_i = stratified_split(
        type(dataset)(
            smiles=[dataset.smiles[i] for i in kept],
            labels=labels_kept,
            label_names=dataset.label_names,
            cids=[dataset.cids[i] for i in kept],
        ),
        seed=args.seed,
    )

    def subset(idx):
        return [graphs[i] for i in idx]

    train_loader = DataLoader(subset(train_i), batch_size=args.batch_size, shuffle=True)
    val_loader = DataLoader(subset(val_i), batch_size=256)
    test_loader = DataLoader(subset(test_i), batch_size=256)

    # Positive weighting on top of focal loss. The tail needs both.
    freq = labels_kept[train_i].mean(axis=0).clip(1e-4, 1 - 1e-4)
    pos_weight = torch.tensor((1 - freq) / freq, dtype=torch.float, device=device).clamp(max=50.0)

    model = ScentNet(
        num_labels=labels_kept.shape[1],
        hidden=args.hidden,
        depth=args.depth,
        embedding_dim=args.embedding_dim,
        dropout=args.dropout,
        use_global=not args.no_global,
    ).to(device)

    criterion = FocalLoss(gamma=args.gamma, pos_weight=pos_weight).to(device)
    optim = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=args.weight_decay)
    sched = torch.optim.lr_scheduler.OneCycleLR(
        optim, max_lr=args.lr, total_steps=args.epochs * max(1, len(train_loader))
    )

    run = None
    if args.wandb:
        import wandb

        run = wandb.init(project="scent", config=vars(args))

    RUNS.mkdir(exist_ok=True)
    best = -1.0

    for epoch in range(1, args.epochs + 1):
        model.train()
        total = 0.0
        for batch in train_loader:
            batch = batch.to(device)
            optim.zero_grad()
            loss = criterion(model(batch), batch.y)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 5.0)
            optim.step()
            sched.step()
            total += loss.detach().item() * batch.num_graphs

        metrics = evaluate(model, val_loader, device)
        train_loss = total / max(1, len(train_i))

        log.info(
            "epoch %3d | loss %.4f | val macro-AUROC %.4f over %d/%d labels",
            epoch,
            train_loss,
            metrics["macro_auroc"],
            metrics["labels_counted"],
            metrics["labels_total"],
        )
        if run:
            run.log({"epoch": epoch, "train_loss": train_loss, **{
                k: v for k, v in metrics.items() if isinstance(v, (int, float))
            }})

        if metrics["macro_auroc"] > best:
            best = metrics["macro_auroc"]
            torch.save(
                {
                    "model": model.state_dict(),
                    "label_names": dataset.label_names,
                    "args": vars(args),
                    "val_macro_auroc": best,
                },
                RUNS / "best.pt",
            )

    test_metrics = evaluate(model, test_loader, device)
    log.info(
        "TEST macro-AUROC %.4f | macro-AP %.4f | %d/%d labels counted (>=%d positives)",
        test_metrics["macro_auroc"],
        test_metrics["macro_ap"],
        test_metrics["labels_counted"],
        test_metrics["labels_total"],
        EVAL_MIN_POSITIVES,
    )

    report = {"test": {k: v for k, v in test_metrics.items() if k != "per_label_auroc"}}

    if args.audit_stereo:
        stereo = audit_stereo(model, dataset, device, use_chirality=not args.no_chirality)
        report["stereo"] = stereo
        log.info("stereo audit: %s", json.dumps(stereo, indent=2))
        if stereo.get("pairs"):
            log.info(
                "enantiomers sit %.1f%% as far apart as random pairs. "
                "Anything near 0%% means the model is blind to handedness",
                100 * stereo.get("ratio", 0.0),
            )

    (RUNS / "report.json").write_text(json.dumps(report, indent=2))


def main() -> None:
    p = argparse.ArgumentParser(description="Train the odor GNN.")
    p.add_argument("--epochs", type=int, default=120)
    p.add_argument("--batch-size", type=int, default=64)
    p.add_argument("--lr", type=float, default=1e-3)
    p.add_argument("--weight-decay", type=float, default=1e-5)
    p.add_argument("--hidden", type=int, default=300)
    p.add_argument("--depth", type=int, default=4)
    p.add_argument("--embedding-dim", type=int, default=256)
    p.add_argument("--dropout", type=float, default=0.15)
    p.add_argument("--gamma", type=float, default=2.0)
    p.add_argument("--seed", type=int, default=0)
    p.add_argument("--device", default=None)
    p.add_argument("--wandb", action="store_true")
    # the two ablation arms from the brief
    p.add_argument("--no-chirality", action="store_true", help="drop chirality tags")
    p.add_argument("--no-global", action="store_true", help="drop RDKit descriptors at readout")
    p.add_argument("--audit-stereo", action="store_true", help="measure the enantiomer blind spot")
    args = p.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(message)s")
    torch.manual_seed(args.seed)
    np.random.seed(args.seed)
    train(args)


if __name__ == "__main__":
    main()
