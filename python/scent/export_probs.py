"""Export the classifier head the site normally throws away.

embed.py keeps the penultimate layer and discards the predictions, because the
map is the artefact. The Cohere bridge needs the opposite: it projects each
molecule into text space as a weighted sum of descriptor-name embeddings, and
the weights have to come from somewhere.

GS-LF's own labels are too sparse for that. Toluene carries exactly one label,
"sweet", so a binary weighted sum would place it precisely on the "sweet"
anchor and nowhere near solvents. The trained head predicts all 150 at once, so
toluene comes back with a profile rather than a single word. That is the whole
reason this file exists.

    python/.venv/bin/python -m scent.export_probs --checkpoint runs/best.pt

Writes public/scent/probs.json: for each GS-LF molecule, the top TOP_K
descriptor probabilities as (index, probability) pairs. Sparse because the full
5,548 x 150 matrix is 832k floats and the tail is noise.
"""

from __future__ import annotations

import argparse
import json
import logging
from pathlib import Path

import numpy as np
import torch

from .data import load_gslf
from .embed import load_model
from .featurize import featurize

log = logging.getLogger(__name__)

ROOT = Path(__file__).resolve().parent.parent.parent
PUBLIC = ROOT / "public" / "scent"

# How many descriptors define a molecule's position in text space. Twenty four
# of 150 keeps the informative head of the distribution and drops a tail that
# is mostly the model hedging.
TOP_K = 24
ROUND = 4


def main() -> None:
    p = argparse.ArgumentParser(description="Export GNN descriptor probabilities.")
    p.add_argument("--checkpoint", required=True)
    p.add_argument("--device", default=None)
    p.add_argument("--top-k", type=int, default=TOP_K)
    args = p.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(message)s")
    device = torch.device(args.device or "cpu")

    model, ckpt, saved = load_model(args.checkpoint, device)
    labels: list[str] = ckpt["label_names"]
    use_chir = not saved.get("no_chirality", False)
    use_glob = not saved.get("no_global", False)

    ds = load_gslf()
    log.info("scoring %d GS-LF molecules against %d labels", len(ds), len(labels))

    from torch_geometric.loader import DataLoader

    graphs, kept = [], []
    for s in ds.smiles:
        g = featurize(s, use_chirality=use_chir, use_global=use_glob)
        if g is not None:
            graphs.append(g)
            kept.append(s)

    out = []
    with torch.no_grad():
        for batch in DataLoader(graphs, batch_size=128):
            logits = model(batch.to(device))
            out.append(torch.sigmoid(logits).cpu())

    P = torch.cat(out).numpy() if out else np.zeros((0, len(labels)))
    log.info("  scored %d molecules", P.shape[0])

    k = min(args.top_k, P.shape[1])
    idx = np.argsort(-P, axis=1)[:, :k]

    rows = []
    for i in range(P.shape[0]):
        js = idx[i]
        rows.append(
            {
                "i": [int(j) for j in js],
                "p": [round(float(P[i, j]), ROUND) for j in js],
            }
        )

    payload = {
        "note": (
            "Top-k descriptor probabilities from the trained D-MPNN classifier "
            "head, per GS-LF molecule, in the same order as atlas.json. Used as "
            "the weights that project a molecule into Cohere text space. Built "
            "by python/scent/export_probs.py."
        ),
        "model": "gnn-dmpnn",
        "labels": labels,
        "topK": k,
        "molecules": len(rows),
        "smiles": kept,
        "rows": rows,
    }

    dest = PUBLIC / "probs.json"
    dest.write_text(json.dumps(payload, separators=(",", ":")))
    log.info("wrote %s  (%.2f MB)", dest, dest.stat().st_size / 1e6)

    # A quick sanity line: the molecule that motivated this file.
    for probe in ("Cc1ccccc1", "CC1CCCC2(C)CCCCC12O"):
        if probe in kept:
            i = kept.index(probe)
            top = [(labels[j], round(float(P[i, j]), 3)) for j in idx[i][:6]]
            log.info("  %s -> %s", probe, top)


if __name__ == "__main__":
    main()
