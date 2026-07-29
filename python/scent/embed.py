"""Export the trained embedding for the website.

Writes two files, because the site has two different needs:

  public/scent/atlas.json         all 5,548 GS-LF molecules. Fetched at runtime
                                  rather than bundled (it is ~1-2 MB and the)
                                  page must paint before it arrives.

  src/data/scent/embedding.json   the projection basis (descriptor directions,
                                  IDF, 2D layout for the curated set). Small,
                                  bundled, and what turns text into a point.

The GNN embeds *molecules*, not descriptor vectors, so the text layer needs a
bridge: `fit_descriptor_directions` regresses each descriptor onto the trained
embedding, answering "which direction in GNN space does 'smoky' point?". That
regression is approximate by construction and is the weakest link between the
text input and the model. Worth stating rather than hiding.

Dimensionality is reduced from the model's native 256 to `--dims` (default 48)
by PCA before shipping. At 5,548 molecules, 256 float columns is ~13 MB of
JSON; 48 keeps well over 90% of the variance at a fraction of the size, and
nearest-neighbour rankings are essentially unchanged.
"""

from __future__ import annotations

import argparse
import json
import logging
import re
from pathlib import Path

import numpy as np
import torch

from .data import load_gslf
from .featurize import featurize
from .model import ScentNet

log = logging.getLogger(__name__)

ROOT = Path(__file__).resolve().parent.parent.parent
SITE_DATA = ROOT / "src" / "data" / "scent"
PUBLIC = ROOT / "public" / "scent"
ROUND = 4  # 4dp is well below the noise floor of a cosine ranking


def load_model(checkpoint: str, device):
    ckpt = torch.load(checkpoint, map_location=device, weights_only=False)
    saved = ckpt.get("args", {})
    model = ScentNet(
        num_labels=len(ckpt["label_names"]),
        hidden=saved.get("hidden", 300),
        depth=saved.get("depth", 4),
        embedding_dim=saved.get("embedding_dim", 256),
        use_global=not saved.get("no_global", False),
    ).to(device)
    model.load_state_dict(ckpt["model"])
    model.eval()
    return model, ckpt, saved


def embed_smiles(model, smiles_list, device, use_chirality, use_global, batch_size=256):
    from torch_geometric.loader import DataLoader

    graphs, kept = [], []
    for i, smi in enumerate(smiles_list):
        g = featurize(smi, use_chirality=use_chirality, use_global=use_global)
        if g is not None:
            graphs.append(g)
            kept.append(i)

    out = []
    with torch.no_grad():
        for batch in DataLoader(graphs, batch_size=batch_size):
            out.append(model.embed(batch.to(device)).cpu().numpy())
    return (np.concatenate(out) if out else np.zeros((0, 1))), kept


def pca_reduce(E: np.ndarray, dims: int):
    """PCA to `dims`, returning (reduced, explained_fraction)."""
    mean = E.mean(axis=0, keepdims=True)
    X = E - mean
    # economy SVD: 5.5k x 256 is trivial
    U, S, Vt = np.linalg.svd(X, full_matrices=False)
    k = min(dims, Vt.shape[0])
    reduced = X @ Vt[:k].T
    explained = float((S[:k] ** 2).sum() / max((S**2).sum(), 1e-12))
    # renormalise so cosine similarity remains a dot product
    norms = np.linalg.norm(reduced, axis=1, keepdims=True)
    reduced = reduced / np.maximum(norms, 1e-9)
    return reduced, explained, Vt[:k], mean


def classical_mds_2d(E: np.ndarray, sample_cap: int = 1200, seed: int = 0):
    """2D layout. On >1.2k points the full O(n^2) eigendecomposition is wasteful,
    so the basis is fitted on a deterministic sample and applied to everything."""
    rng = np.random.default_rng(seed)
    n = E.shape[0]
    idx = np.arange(n) if n <= sample_cap else rng.choice(n, sample_cap, replace=False)
    S = E[idx]

    sq = ((S[:, None, :] - S[None, :, :]) ** 2).sum(-1)
    m = sq.shape[0]
    J = np.eye(m) - np.ones((m, m)) / m
    B = -0.5 * J @ sq @ J
    vals, vecs = np.linalg.eigh(B)
    order = np.argsort(vals)[::-1][:2]
    coords_s = vecs[:, order] * np.sqrt(np.maximum(vals[order], 0))

    # Recover a basis in embedding space so every molecule can be placed.
    basis = np.stack([coords_s[:, k] @ S for k in range(2)])
    coords = np.stack([E @ basis[k] for k in range(2)], axis=1)

    for k in range(2):
        big = np.argmax(np.abs(coords[:, k]))
        if coords[big, k] < 0:
            coords[:, k] *= -1
            basis[k] *= -1

    scale = np.abs(coords).max() or 1.0
    return coords / scale, basis, float(scale)


def fit_descriptor_directions(E: np.ndarray, Y: np.ndarray, lam: float = 1e-2) -> np.ndarray:
    """Ridge regression: descriptor space -> embedding space."""
    A = Y.T @ Y + lam * np.eye(Y.shape[1])
    return np.linalg.solve(A, Y.T @ E)  # (n_descriptors, k)


def main() -> None:
    p = argparse.ArgumentParser(description="Export the trained embedding for the site.")
    p.add_argument("--checkpoint", required=True)
    p.add_argument("--dims", type=int, default=48)
    p.add_argument("--device", default=None)
    p.add_argument("--atlas", default=str(PUBLIC / "atlas.json"))
    p.add_argument("--basis", default=str(SITE_DATA / "embedding.json"))
    args = p.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(message)s")
    device = torch.device(args.device or "cpu")

    model, ckpt, saved = load_model(args.checkpoint, device)
    use_chir = not saved.get("no_chirality", False)
    use_glob = not saved.get("no_global", False)

    # ── the full labelled corpus ────────────────────────────────────
    ds = load_gslf()
    log.info("embedding %d GS-LF molecules…", len(ds))
    E_full, kept = embed_smiles(model, ds.smiles, device, use_chir, use_glob)
    log.info("  embedded %d at %d dims", E_full.shape[0], E_full.shape[1])

    E, explained, pca_basis, pca_mean = pca_reduce(E_full, args.dims)
    log.info("  PCA %d -> %d dims, %.1f%% variance retained",
             E_full.shape[1], E.shape[1], explained * 100)

    coords, mds_basis, _ = classical_mds_2d(E)

    # ── site vocabulary bridge ──────────────────────────────────────
    dsrc = (SITE_DATA / "descriptors.ts").read_text()
    site_vocab = re.findall(r'\{\s*id:\s*"([^"]+)"', dsrc)
    v_index = {d: i for i, d in enumerate(site_vocab)}

    # GS-LF label names -> site vocabulary.
    #
    # Only EXACT name matches. An earlier version added "spelling bridges"
    # (animal->animalic, chemical->tarry/rubbery/plastic, pungent->sweaty) to
    # close the 15 descriptors GS-LF has no word for. Measured, that made
    # retrieval worse (8/14 anchors versus 11/14) because mapping one GS-LF
    # label onto three site descriptors gives all three the same direction and
    # smears percepts that the nose keeps apart. Guessed synonyms are worse
    # than admitted gaps, so they are gone.
    SITE_TO_GSLF = {
        "animalic": "animal",
        "leather": "leathery",
        "savoury": "savory",
        "orangeblossom": "orangeflower",
    }

    gs_to_site: dict[str, int] = {
        name: v_index[name] for name in ds.label_names if name in v_index
    }
    for site_name, gs_name in SITE_TO_GSLF.items():
        if site_name in v_index and gs_name in ds.label_names and gs_name not in gs_to_site:
            gs_to_site[gs_name] = v_index[site_name]

    log.info(
        "  %d/%d GS-LF labels map onto the site vocabulary",
        len(gs_to_site), len(ds.label_names),
    )

    r = lambda a: np.round(np.asarray(a, dtype=float), ROUND).tolist()

    # ── the curated 152, in the SAME reduced space ──────────────────
    # Needed here (before the regression) as well as for the site payload:
    # these carry hand-labels in the *site's* vocabulary, which is the only
    # source covering all 87 descriptors. GS-LF supplies volume; the curated
    # set supplies coverage. Fitting on both is what gives every descriptor a
    # real direction without inventing synonyms.
    curated = json.loads((SITE_DATA / "molecules.json").read_text())
    E_cur_full, cur_kept = embed_smiles(
        model, [m["smiles"] for m in curated], device, use_chir, use_glob
    )
    Xc = (E_cur_full - pca_mean) @ pca_basis.T
    Xc = Xc / np.maximum(np.linalg.norm(Xc, axis=1, keepdims=True), 1e-9)

    Y_gs = np.zeros((len(kept), len(site_vocab)))
    for row, orig in enumerate(kept):
        for j, name in enumerate(ds.label_names):
            if ds.labels[orig, j] and name in gs_to_site:
                Y_gs[row, gs_to_site[name]] = 1.0

    Y_cur = np.zeros((len(cur_kept), len(site_vocab)))
    for row, orig in enumerate(cur_kept):
        for d in curated[orig]["descriptors"]:
            if d in v_index:
                Y_cur[row, v_index[d]] = 1.0

    # The curated rows are few but carry the only signal for ~15 descriptors,
    # so they are upweighted rather than drowned by 5.5k GS-LF rows.
    CURATED_WEIGHT = 6.0
    E_fit = np.vstack([E, np.repeat(Xc, int(CURATED_WEIGHT), axis=0)])
    Y_fit = np.vstack([Y_gs, np.repeat(Y_cur, int(CURATED_WEIGHT), axis=0)])

    df = Y_fit.sum(axis=0)
    idf = np.log((1 + len(Y_fit)) / (1 + df)) + 1
    directions = fit_descriptor_directions(E_fit, Y_fit * idf)

    zero = [d for d, n in zip(site_vocab, np.linalg.norm(directions, axis=1)) if n < 1e-6]
    log.info("  descriptor directions fitted; %d of %d still have no signal%s",
             len(zero), len(site_vocab), f": {zero}" if zero else "")

    # ── atlas: everything, fetched at runtime ───────────────────────
    PUBLIC.mkdir(parents=True, exist_ok=True)
    atlas = {
        "method": "gnn-dmpnn",
        "checkpoint": Path(args.checkpoint).name,
        "k": int(E.shape[1]),
        "count": len(kept),
        "labels": ds.label_names,
        "molecules": [
            {
                "id": f"gslf-{ds.cids[o]}",
                "smiles": ds.smiles[o],
                "d": [j for j, name in enumerate(ds.label_names) if ds.labels[o, j]],
                "e": r(E[i]),
                "xy": r(coords[i]),
            }
            for i, o in enumerate(kept)
        ],
    }
    Path(args.atlas).write_text(json.dumps(atlas, separators=(",", ":")))
    size_mb = Path(args.atlas).stat().st_size / 1e6
    log.info("wrote %s  (%.2f MB)", args.atlas, size_mb)

    # 2D placement for the curated set, in the atlas's coordinate frame.
    cur_coords = np.stack([Xc @ mds_basis[k] for k in range(2)], axis=1)
    cur_scale = np.abs(cur_coords).max() or 1.0
    cur_coords = cur_coords / cur_scale
    log.info("  curated set: %d/%d embedded into the same space", len(cur_kept), len(curated))

    # ── basis: small, bundled ───────────────────────────────────────
    basis_payload = {
        "method": "gnn-dmpnn",
        "note": (
            f"Exported by python/scent/embed.py from {Path(args.checkpoint).name}. "
            "Penultimate layer of a D-MPNN trained on GoodScents+Leffingwell "
            f"({len(ds)} molecules, {len(ds.label_names)} labels)."
        ),
        "k": int(E.shape[1]),
        "molecules": len(kept),
        "explainedVariance": round(explained, 4),
        "descriptors": site_vocab,
        "idf": r(idf),
        "components": [r(c) for c in directions.T],
        "mdsBasis": [r(b) for b in mds_basis],
        "mdsScale": [round(1.0 / cur_scale, 6), round(1.0 / cur_scale, 6)],
        "embeddings": {
            curated[o]["id"]: r(Xc[i]) for i, o in enumerate(cur_kept)
        },
        "xy": {
            curated[o]["id"]: r(cur_coords[i]) for i, o in enumerate(cur_kept)
        },
        "trainingMetrics": {
            "valMacroAuroc": ckpt.get("val_macro_auroc"),
            "labels": len(ds.label_names),
            "trainingMolecules": len(ds),
        },
    }
    Path(args.basis).write_text(json.dumps(basis_payload, indent=1) + "\n")
    log.info("wrote %s", args.basis)


if __name__ == "__main__":
    main()
