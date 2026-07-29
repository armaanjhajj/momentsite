"""Pyrfume loaders, written against the archives as they actually ship.

Verified layout (pyrfume as of this writing):

  leffingwell/molecules.csv   3522 rows, index CID, has IsomericSMILES
  leffingwell/behavior.csv    3522 x 113, index Stimulus (== CID), values 0/1
  goodscents/molecules.csv    4565 rows, index CID, has IsomericSMILES
  goodscents/behavior.csv     4626 x 1,  index Stimulus (CAS), ';'-joined tokens
  goodscents/stimuli.csv      maps Stimulus -> CID
  snitz_2013/behavior.csv     360 pairs; StimulusA/B are COMMA-SEPARATED CID
                              lists (mixtures), Similarity 0-100

Union of the two labelled archives is ~5,862 molecules, deduplicated on
canonical SMILES rather than CID. Leffingwell assigns synthetic negative CIDs
to compounds with no PubChem entry, so the same molecule can carry two
different keys across archives.

Snitz is HELD OUT. It is the eval that decides whether the embedding is a map,
so it must never touch training.
"""

from __future__ import annotations

import argparse
import logging
import re
from collections import Counter
from dataclasses import dataclass

import numpy as np
import pandas as pd

log = logging.getLogger(__name__)

# Labels below this many positives are dropped. Keeping a label with 8
# positives out of 5,800 does not teach the model anything and makes
# macro-AUROC swing wildly between seeds.
MIN_LABEL_SUPPORT = 30

# GoodScents spells a few things differently from Leffingwell. Only obvious,
# unambiguous collisions are merged. This is not a place to be clever.
ALIASES = {
    "jasmin": "jasmine",
    "mentholic": "menthol",
    "medicinal": "medicinal",
    "aniseed": "anise",
    "liquorice": "licorice",
}


@dataclass
class OdorDataset:
    smiles: list[str]
    labels: np.ndarray  # (n_molecules, n_labels), binary
    label_names: list[str]
    cids: list[int]

    def __len__(self) -> int:
        return len(self.smiles)

    def describe(self) -> str:
        support = self.labels.sum(axis=0)
        return (
            f"{len(self)} molecules x {len(self.label_names)} labels | "
            f"support min {int(support.min())}, median {int(np.median(support))}, "
            f"max {int(support.max())} | mean labels/molecule "
            f"{self.labels.sum(axis=1).mean():.2f}"
        )


def _norm_token(t: str) -> str:
    t = re.sub(r"\s+", " ", str(t).strip().lower())
    return ALIASES.get(t, t)


def _canonical(smiles: str) -> str | None:
    from rdkit import Chem, RDLogger

    RDLogger.DisableLog("rdApp.*")
    mol = Chem.MolFromSmiles(str(smiles))
    if mol is None or mol.GetNumAtoms() == 0:
        return None
    return Chem.MolToSmiles(mol)


def load_gslf(min_support: int = MIN_LABEL_SUPPORT) -> OdorDataset:
    """GoodScents + Leffingwell, merged, deduplicated, binarised."""
    import pyrfume

    # ── Leffingwell: already a clean binary matrix ──────────────────
    lf_mol = pyrfume.load_data("leffingwell/molecules.csv")
    lf_beh = pyrfume.load_data("leffingwell/behavior.csv")

    lf_labels = [_norm_token(c) for c in lf_beh.columns]
    lf_smiles = lf_mol["IsomericSMILES"].astype(str).to_dict()

    # ── GoodScents: semicolon-joined free text ──────────────────────
    gs_mol = pyrfume.load_data("goodscents/molecules.csv")
    gs_beh = pyrfume.load_data("goodscents/behavior.csv")
    gs_sti = pyrfume.load_data("goodscents/stimuli.csv")

    stim_to_cid = gs_sti["CID"].dropna().astype(int).to_dict()
    gs_smiles = gs_mol["IsomericSMILES"].astype(str).to_dict()

    # per-molecule token sets, keyed by canonical SMILES
    records: dict[str, set[str]] = {}
    cid_of: dict[str, int] = {}

    def add(smiles_raw: str, tokens: set[str], cid: int) -> None:
        can = _canonical(smiles_raw)
        if can is None or not tokens:
            return
        records.setdefault(can, set()).update(tokens)
        cid_of.setdefault(can, cid)

    for cid, row in lf_beh.iterrows():
        smi = lf_smiles.get(cid)
        if smi is None:
            continue
        tokens = {lab for lab, v in zip(lf_labels, row.to_numpy()) if v == 1}
        add(smi, tokens, int(cid))

    for stim, row in gs_beh.iterrows():
        cid = stim_to_cid.get(stim)
        if cid is None:
            continue
        smi = gs_smiles.get(cid)
        if smi is None:
            continue
        raw = row.get("Descriptors")
        if not isinstance(raw, str):
            continue
        tokens = {_norm_token(t) for t in raw.split(";") if t.strip()}
        add(smi, tokens - {""}, int(cid))

    log.info("merged to %d unique molecules (by canonical SMILES)", len(records))

    # ── vocabulary ──────────────────────────────────────────────────
    counts = Counter()
    for toks in records.values():
        counts.update(toks)

    # "odorless" is a statement about the absence of the thing we are modelling;
    # as a target it teaches the network to predict nothing.
    counts.pop("odorless", None)

    label_names = sorted(t for t, n in counts.items() if n >= min_support)
    log.info(
        "vocabulary: %d labels at support >= %d (from %d raw tokens)",
        len(label_names), min_support, len(counts),
    )

    l_index = {t: i for i, t in enumerate(label_names)}

    smiles_list, cids_list, rows = [], [], []
    for can, toks in records.items():
        vec = np.zeros(len(label_names), dtype=np.int8)
        hit = False
        for t in toks:
            j = l_index.get(t)
            if j is not None:
                vec[j] = 1
                hit = True
        if not hit:
            continue  # no surviving labels -> no signal
        smiles_list.append(can)
        cids_list.append(cid_of[can])
        rows.append(vec)

    labels = np.stack(rows)
    return OdorDataset(
        smiles=smiles_list, labels=labels, label_names=label_names, cids=cids_list
    )


def load_snitz_pairs() -> pd.DataFrame:
    """Snitz single-molecule pairs with human similarity ratings.

 HELD OUT. Used only by eval_snitz.py.

    Two filters matter:
      * StimulusA/B are comma-separated CID lists; most pairs are MIXTURES.
        Only single-vs-single pairs can be compared against a single-molecule
        embedding, which leaves 83 of 360.
      * Self-pairs (A == B) are the study's internal reliability check. They
        are trivially distance 0 in any embedding, so including them would
        inflate the correlation for free.

    Returns columns (smiles_a, smiles_b, similarity, distance) with distance
    normalised to [0, 1] and oriented so larger = more different.
    """
    import pyrfume

    beh = pyrfume.load_data("snitz_2013/behavior.csv")
    mol = pyrfume.load_data("snitz_2013/molecules.csv")
    smiles_by_cid = mol["IsomericSMILES"].astype(str).to_dict()

    rows = []
    for _, r in beh.iterrows():
        a, b = str(r["StimulusA"]).strip(), str(r["StimulusB"]).strip()
        if "," in a or "," in b:
            continue  # mixture
        if a == b:
            continue  # reliability check, not a comparison
        try:
            cid_a, cid_b = int(a), int(b)
        except ValueError:
            continue
        sa, sb = smiles_by_cid.get(cid_a), smiles_by_cid.get(cid_b)
        if not sa or not sb:
            continue
        rows.append(
            {
                "cid_a": cid_a,
                "cid_b": cid_b,
                "smiles_a": sa,
                "smiles_b": sb,
                "similarity": float(r["Similarity"]),
            }
        )

    out = pd.DataFrame(rows)
    if out.empty:
        return out

    # Snitz similarity is 0-100, higher = more alike. Flip to distance.
    out["distance"] = 1.0 - (out["similarity"] / 100.0)
    return out


def stratified_split(
    dataset: OdorDataset, seed: int = 0, fractions: tuple[float, float, float] = (0.8, 0.1, 0.1)
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Iterative stratification over the multi-label targets.

    A plain random split leaves rare labels absent from validation entirely,
    which makes per-label AUROC undefined exactly where it matters most.
    """
    from iterstrat.ml_stratifiers import MultilabelStratifiedShuffleSplit

    n = len(dataset)
    idx = np.arange(n).reshape(-1, 1)

    _, val_frac, test_frac = fractions
    first = MultilabelStratifiedShuffleSplit(
        n_splits=1, test_size=val_frac + test_frac, random_state=seed
    )
    train_idx, rest_idx = next(first.split(idx, dataset.labels))

    rel = test_frac / (val_frac + test_frac)
    second = MultilabelStratifiedShuffleSplit(n_splits=1, test_size=rel, random_state=seed)
    val_rel, test_rel = next(
        second.split(rest_idx.reshape(-1, 1), dataset.labels[rest_idx])
    )

    return train_idx, rest_idx[val_rel], rest_idx[test_rel]


def main() -> None:
    parser = argparse.ArgumentParser(description="Inspect the merged Pyrfume data.")
    parser.add_argument("--min-support", type=int, default=MIN_LABEL_SUPPORT)
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(message)s")

    ds = load_gslf(min_support=args.min_support)
    print(ds.describe())

    train, val, test = stratified_split(ds)
    print(f"split: {len(train)} train / {len(val)} val / {len(test)} test")

    support = ds.labels.sum(axis=0)
    order = np.argsort(support)
    print("\nrarest labels kept:")
    for i in order[:10]:
        print(f"  {ds.label_names[i]:<22} {int(support[i])}")
    print("commonest labels:")
    for i in order[-10:][::-1]:
        print(f"  {ds.label_names[i]:<22} {int(support[i])}")

    snitz = load_snitz_pairs()
    print(f"\nsnitz held-out pairs (single vs single, self-pairs removed): {len(snitz)}")
    if not snitz.empty:
        print(f"  human distance range: {snitz['distance'].min():.3f} .. {snitz['distance'].max():.3f}")


if __name__ == "__main__":
    main()
