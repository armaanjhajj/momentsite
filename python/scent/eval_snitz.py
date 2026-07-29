"""The eval that decides whether this is a map or a classifier.

Everything else in this pipeline measures how well the model reproduces labels
it was trained on. This measures something it was never shown: do pairs of
molecules that *humans* rated as similar actually sit close together in the
learned embedding?

If yes, the geometry recovered human perception and you built an odor map. If
no, you built a descriptor classifier with a hidden layer. Both are results.
Only one of them is the interesting one, and reporting the boring one honestly
is worth more than not running the test.

Snitz data is held out. It never enters training. See data.py.
"""

from __future__ import annotations

import argparse
import json
import logging

import numpy as np
import torch
from scipy.stats import pearsonr, spearmanr

from .data import load_gslf, load_snitz_pairs
from .embed import pca_reduce
from .featurize import featurize
from .model import ScentNet

log = logging.getLogger(__name__)


def embed_smiles(model, smiles: list[str], device, use_chirality: bool, use_global: bool):
    """Embed a list of SMILES, returning (matrix, index_of_smiles)."""
    from torch_geometric.loader import DataLoader

    graphs, kept = [], []
    for s in smiles:
        g = featurize(s, use_chirality=use_chirality, use_global=use_global)
        if g is not None:
            graphs.append(g)
            kept.append(s)

    model.eval()
    out = []
    with torch.no_grad():
        for batch in DataLoader(graphs, batch_size=128):
            out.append(model.embed(batch.to(device)).cpu())

    E = torch.cat(out) if out else torch.zeros(0, model.embedding_dim)
    return E, {s: i for i, s in enumerate(kept)}


def morgan_baseline(pairs, radius: int = 2, nbits: int = 2048) -> np.ndarray:
    """Structural-similarity control: Tanimoto distance on Morgan fingerprints.

    This is the experiment that makes the headline number mean anything. The
    project's whole premise is that structure does not predict percept (so if)
    plain fingerprint distance correlates with human ratings just as well as
    the learned embedding does, the embedding added nothing and the premise is
    wrong. Running the control is the difference between a claim and a result.
    """
    from rdkit import Chem, DataStructs
    from rdkit.Chem import rdFingerprintGenerator

    gen = rdFingerprintGenerator.GetMorganGenerator(radius=radius, fpSize=nbits)
    out = []
    for _, r in pairs.iterrows():
        ma = Chem.MolFromSmiles(r["smiles_a"])
        mb = Chem.MolFromSmiles(r["smiles_b"])
        if ma is None or mb is None:
            out.append(np.nan)
            continue
        fa, fb = gen.GetFingerprint(ma), gen.GetFingerprint(mb)
        out.append(1.0 - DataStructs.TanimotoSimilarity(fa, fb))
    return np.array(out)


def permutation_test(x: np.ndarray, y: np.ndarray, observed: float, n: int = 10_000, seed: int = 0) -> float:
    """How often does shuffling produce a correlation at least this strong?

    Reported instead of a bare p-value from the correlation itself, because
 the pairs are not independent. The same molecule appears in many pairs,
    which inflates significance under the standard assumption.
    """
    rng = np.random.default_rng(seed)
    count = 0
    for _ in range(n):
        if abs(spearmanr(x, rng.permutation(y)).statistic) >= abs(observed):
            count += 1
    return (count + 1) / (n + 1)


def main() -> None:
    p = argparse.ArgumentParser(description="Validate embedding geometry against human ratings.")
    p.add_argument("--checkpoint", required=True)
    p.add_argument("--device", default=None)
    p.add_argument("--permutations", type=int, default=10_000)
    p.add_argument(
        "--shipped-dims",
        type=int,
        default=None,
        help=(
            "Also score the reduced representation the site actually ships. "
            "The model emits 256 dims; embedding.json carries 48 after a PCA "
            "fitted on the GS-LF atlas. Without this flag the reported rho "
            "describes vectors no browser ever sees."
        ),
    )
    p.add_argument("--out", default=None, help="write metrics as JSON")
    args = p.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(message)s")
    device = torch.device(args.device or ("cuda" if torch.cuda.is_available() else "cpu"))

    ckpt = torch.load(args.checkpoint, map_location=device)
    saved = ckpt.get("args", {})

    model = ScentNet(
        num_labels=len(ckpt["label_names"]),
        hidden=saved.get("hidden", 300),
        depth=saved.get("depth", 4),
        embedding_dim=saved.get("embedding_dim", 256),
        use_global=not saved.get("no_global", False),
    ).to(device)
    model.load_state_dict(ckpt["model"])

    snitz = load_snitz_pairs()
    log.info("snitz: %d held-out single-molecule pairs", len(snitz))

    smiles = sorted(set(snitz["smiles_a"]) | set(snitz["smiles_b"]))
    E, index = embed_smiles(
        model, smiles, device,
        use_chirality=not saved.get("no_chirality", False),
        use_global=not saved.get("no_global", False),
    )
    log.info("embedded %d/%d molecules", len(index), len(smiles))

    # ── the representation that ships ───────────────────────────────
    #
    # The PCA basis is fitted on the atlas, not on Snitz, and Snitz molecules
    # are projected through it exactly as the curated set is in embed.py. That
    # ordering matters: fitting the basis on the evaluation set would leak.
    E_shipped = None
    if args.shipped_dims:
        ds = load_gslf()
        log.info("fitting the shipped PCA on %d GS-LF molecules…", len(ds))
        E_atlas, _ = embed_smiles(model, ds.smiles, device, use_chirality=not saved.get("no_chirality", False), use_global=not saved.get("no_global", False))
        _, explained, basis, mean = pca_reduce(E_atlas.numpy(), args.shipped_dims)
        log.info("  PCA %d -> %d dims, %.1f%% variance retained",
                 E_atlas.shape[1], basis.shape[0], explained * 100)

        Z = (E.numpy() - mean) @ basis.T
        Z = Z / np.maximum(np.linalg.norm(Z, axis=1, keepdims=True), 1e-9)
        E_shipped = torch.from_numpy(Z).float()

    model_d, shipped_d, human_d, usable_rows = [], [], [], []
    for i, row in snitz.iterrows():
        ia, ib = index.get(row["smiles_a"]), index.get(row["smiles_b"])
        if ia is None or ib is None:
            continue
        model_d.append(float(1.0 - torch.dot(E[ia], E[ib])))
        if E_shipped is not None:
            shipped_d.append(float(1.0 - torch.dot(E_shipped[ia], E_shipped[ib])))
        human_d.append(float(row["distance"]))
        usable_rows.append(i)

    if len(model_d) < 30:
        log.error("only %d usable pairs, not enough to conclude anything", len(model_d))
        return

    model_d = np.array(model_d)
    human_d = np.array(human_d)

    rho = spearmanr(model_d, human_d)
    r = pearsonr(model_d, human_d)
    pval = permutation_test(model_d, human_d, rho.statistic, n=args.permutations)

    # ── the control ──────────────────────────────────────────────────
    struct_d = morgan_baseline(snitz.loc[usable_rows])
    ok = ~np.isnan(struct_d)
    struct_rho = spearmanr(struct_d[ok], human_d[ok]).statistic
    struct_p = permutation_test(
        struct_d[ok], human_d[ok], struct_rho, n=args.permutations
    )

    shipped_block = None
    if shipped_d:
        shipped_d = np.array(shipped_d)
        s_rho = spearmanr(shipped_d, human_d)
        s_r = pearsonr(shipped_d, human_d)
        s_p = permutation_test(shipped_d, human_d, s_rho.statistic, n=args.permutations)
        shipped_block = {
            "dims": int(args.shipped_dims),
            "note": "src/data/scent/embedding.json, PCA fitted on the GS-LF atlas",
            "spearman_rho": float(s_rho.statistic),
            "pearson_r": float(s_r.statistic),
            "permutation_p": float(s_p),
        }

    result = {
        "pairs_used": int(len(model_d)),
        "pairs_total": int(len(snitz)),
        "molecules": int(len(index)),
        "embedding": {
            "dims": int(E.shape[1]),
            "note": "the model's native output, not what the site ships",
            "spearman_rho": float(rho.statistic),
            "pearson_r": float(r.statistic),
            "permutation_p": float(pval),
        },
        "shipped_embedding": shipped_block,
        "morgan_fingerprint_baseline": {
            "spearman_rho": float(struct_rho),
            "permutation_p": float(struct_p),
        },
        "permutations": args.permutations,
    }

    log.info("\n" + json.dumps(result, indent=2))
    log.info(
        "\n  learned embedding   Spearman rho = %+.3f  (permutation p = %.4f)",
        result["embedding"]["spearman_rho"], result["embedding"]["permutation_p"],
    )
    log.info(
        "  Morgan fingerprint  Spearman rho = %+.3f  (permutation p = %.4f)",
        struct_rho, struct_p,
    )
    log.info("  over %d held-out pairs across %d molecules.\n", len(model_d), len(index))

    delta = result["embedding"]["spearman_rho"] - struct_rho
    if delta > 0.1:
        log.info(
            "The embedding beats raw structural similarity by %.3f. That gap is the "
            "whole claim: perceptual distance is not structural distance, and the "
            "model learned the difference.", delta,
        )
    elif delta > 0:
        log.info(
 "The embedding edges out structure by only %.3f. Weaker than hoped. "
            "Report it as measured.", delta,
        )
    else:
        log.info(
            "Structural similarity matches or beats the embedding here. That is a "
            "negative result and should be reported as one: on this eval the "
            "learned space added nothing over a fingerprint."
        )

    if args.out:
        with open(args.out, "w") as f:
            json.dump(result, f, indent=2)


if __name__ == "__main__":
    main()
