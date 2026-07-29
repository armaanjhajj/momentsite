# What is known about the training run

Written 2026-07-28, after the fact, from filesystem evidence. This file exists
because the run itself was not recorded, and an undocumented gap is worse than
a documented one.

## The short version

**The training run that produced `best.pt` is not reproducible.** The
checkpoint exists and the metrics computed from it are real, but the run cannot
be reconstructed from this repository. Treat `best.pt` as an irreplaceable
artifact, which is why it is committed here despite its size.

## What is recorded

| Fact | Value | How it is known |
|---|---|---|
| Checkpoint | `best.pt`, 3,121,573 bytes | on disk |
| Checkpoint written | 2026-07-28 14:03 local (EDT) | mtime |
| `report.json` written | 2026-07-28 14:04 | mtime |
| `snitz.json` written | 2026-07-28 14:06, rewritten 20:29 | mtime |
| Test macro-AUROC | 0.8460 over 114 of 150 labels | `report.json` |
| Test macro-AP | 0.3282 | `report.json` |
| Validation macro-AUROC | 0.8747 over 150 labels | `embedding.json.trainingMetrics` |
| Enantiomer distance ratio | 0.2025 over 912 pairs | `report.json` |
| Chirality tags used | true | `report.json` |
| Snitz Spearman, 256-dim | 0.5773, permutation p = 1.0e-4 | `snitz.json` |
| Snitz Spearman, shipped 48-dim | 0.5534, permutation p = 1.0e-4 | `snitz.json` |
| Morgan fingerprint baseline | 0.2047, permutation p = 0.0737 | `snitz.json` |
| Corpus | 5,548 GS-LF molecules, 150 labels at support >= 30 | `embed.py` stdout |

## What is not recorded, and cannot be recovered

- **Epoch count.** `train.py` defaults to `--epochs 120`, but the value passed
  at invocation was never captured. The checkpoint may or may not have been
  trained for 120 epochs.
- **Wall time.** No timing was taken. The only bracket available is that
  `python/runs/` was created at 14:02 and `best.pt` written at 14:03, which
  gives an end time, not a duration.
- **Per-epoch loss and validation curves.** `train.py:197` logs these to
  stdout. That stdout was not redirected to a file. No log exists anywhere
  under `python/`.
- **Random seed.** Not verified as captured in the checkpoint metadata.
- **Hardware.** No CUDA on the machine that ran it, so CPU or MPS. Which one is
  unknown.
- **Weights & Biases / Optuna.** Both are wired into `train.py` behind flags
  and neither was used. There is no external run record.

## Ablations

`train.py` supports `--no-chirality` and `--no-global`. **Only the full
configuration was run.** There is no measured ablation result, so any claim
about the contribution of chirality tags or global descriptors would be
unsupported.

## Environment at the time of writing

Read from installed package metadata in `python/.venv` on 2026-07-28. The venv
itself is not committed; `setup-env.sh` rebuilds it.

```
torch            2.13.0
torch-geometric  2.8.0.post1
rdkit            2026.3.4
pyrfume          0.19
numpy            1.26.4
scikit-learn     1.9.0
scipy            1.17.1
```

`numpy` is held below 2.0 because `pyrfume` 0.19 calls `np.ndarray.ptp`, which
numpy 2 removed.

## A caveat on the metric files

`report.json` and `snitz.json` were written at 14:04 and 14:06. `embedding.json`
and `atlas.json` were regenerated at 20:00 the same day, after five molecules
were added to the curated set.

Re-running `embed.py` does not retrain, so **macro-AUROC and the enantiomer
ratio remain valid**: they are properties of `best.pt`, which has not changed.

The Snitz numbers are also measured directly from the checkpoint rather than
from `embedding.json`, so they are likewise unaffected. What the 20:00 rebuild
did change is the fitted descriptor directions, because `embed.py` fits those
on the atlas plus the curated set, and the curated set grew from 152 to 157.
That moved where text queries land, which is a property of the site, not of the
model.

## If you retrain

Record, at minimum: the full command line, the epoch count, the seed, the wall
time, and redirect stdout to a file in this directory. None of that was done
for the run above, and this file is the result.

## Rebuild order

These steps are coupled. Running one without the ones after it leaves the site
internally inconsistent, and the symptom is silent: codes that no longer mean
what a stored post says they mean.

```
1. edit src/data/scent/molecules.json          (curated set changes)
2. python/.venv/bin/python -m scent.embed --checkpoint runs/best.pt
                                                (re-fits all 87 descriptor
                                                 directions, moves every query)
3. python/.venv/bin/python python/build_curated_map.py
                                                (re-joins curated to atlas)
4. npm run scent:zones                          (rebuilds the zone tree)
5. npm run scent:stamp                          (new MAP_VERSION, new atlas-xy)
6. npm run scent:rezone -- --dry-run            (see what moved)
7. npm run scent:rezone                         (re-file stored posts)
8. npm run scent:check && npm run scent:naming  (retrieval and naming holds)
```

Step 7 is the one that is easy to forget and expensive to skip. A post keeps
the code it was written with, so skipping it leaves rows filed under a map that
no longer exists. `map_version` on each row is how you tell.
