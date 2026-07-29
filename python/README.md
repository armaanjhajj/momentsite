# SCENT: the training pipeline

The message-passing GNN that the web artifact is a stand-in for.

## Status: written, not run

**Nothing in this directory has been executed.** It was written alongside the
site but never trained, no GPU was available, the dependency tree (PyTorch +
PyTorch Geometric + RDKit) is heavy, and a training run that has not happened
should not be described as though it has.

So treat the numbers this pipeline would produce as unknown, not as pending
confirmation of something already believed. What is shipped and verified is the
site: a TF-IDF + truncated-SVD embedding over 152 hand-curated odorants
(`../scripts/build-scent-embedding.mjs`), which is a genuine learned coordinate
system but a much weaker one than a trained GNN over the full ~5,000-molecule
GoodScents/Leffingwell set would be.

The seam between the two is deliberate and narrow: `scent/embed.py` writes the
**same `embedding.json` format** the site already consumes. Training the model
replaces the map without touching a line of front-end code.

## What it does

```
pyrfume (GS-LF)  ->  RDKit graphs  ->  D-MPNN  ->  penultimate layer
                                                        |
                              +-------------------------+------------------+
                              |                          |                 |
                     embedding.json              ONNX for the browser   Snitz eval
```

1. **`data.py`**. Pulls GoodScents + Leffingwell from Pyrfume, binarises the
   multi-label descriptor targets, and makes an iterative-stratified split that
   keeps rare labels present in every fold. Also fetches Dravnieks and Snitz,
   which are held out and never trained on.
2. **`featurize.py`**. SMILES to graph. Atom and bond features, with
   **chirality tags** included so the carvone failure case is testable rather
   than assumed, and optional RDKit physicochemical descriptors concatenated at
   readout (one arm of the small-data ablation).
3. **`model.py`**, a directed message-passing network with a descriptor head.
   `embed()` returns the penultimate representation, which is the actual
   artifact; the classifier is scaffolding you throw away.
4. **`train.py`**. Focal loss for the long tail, **per-label AUROC macro-averaged
   over labels that clear a support threshold**, W&B and Optuna behind flags.
5. **`embed.py`**. Exports `embedding.json` + ONNX.
6. **`eval_snitz.py`**. The eval that matters: does embedding distance
   correlate with human perceptual-distance ratings the model never saw?

## The evaluation that decides whether this worked

Everything else is a classifier. `eval_snitz.py` is the part that tests whether
the geometry recovered human perception:

- Take Snitz et al.'s pairwise perceptual-distance ratings.
- Compute cosine distance between the same pairs in the learned embedding.
- Report Spearman correlation, with a permutation test for significance.

A strong correlation means the embedding is an odor *map*. A weak one means it
is a descriptor classifier with a hidden layer, and the honest thing is to
report that. Both are results; only one is the interesting one.

## Known blind spot, stated up front

A 2D molecular graph **cannot distinguish enantiomers**. (R)-carvone smells of
spearmint and (S)-carvone smells of caraway, and they have identical
connectivity. `featurize.py` encodes CIP chirality tags so the model has a
chance, but tags alone are a weak signal. There is no 3D geometry here. Expect
this pair to fail, measure it explicitly via `--audit-stereo`, and report it.
The site says the same thing on the page when a carvone is returned.

## Running it

```bash
cd python
uv sync
uv run python -m scent.data --download          # cache Pyrfume locally
uv run python -m scent.train --epochs 120 --effort-ablation
uv run python -m scent.eval_snitz --checkpoint runs/best.pt
uv run python -m scent.embed --checkpoint runs/best.pt \
    --out ../src/data/scent/embedding.json --onnx public/scent/model.onnx
```

Expect the first `uv sync` to be slow; `torch-geometric` builds against the
installed torch.

## Honest gaps

- Untrained, so no reported metrics. Deliberate.
- Pyrfume's archive layout changes between releases; `data.py` pins names that
  may need updating.
- The ONNX export path assumes a fixed maximum graph size. Variable-size graph
  ops in `onnxruntime-web` are the fiddliest part of the browser story and are
  not solved here.
- The site's current 152 molecules are hand-curated with hand-written
  occurrence notes and facts. The GS-LF set has no such annotations, so
  swapping in the trained embedding would give better geometry and a worse
  demo until those notes are written or generated.
