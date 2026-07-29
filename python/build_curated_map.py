"""Join the curated set to the atlas by canonical SMILES.

The curated entries carry hand-typed SMILES ("CC12CCCC(C)(O)C1CCCC2" for
geosmin); the atlas carries whatever RDKit canonicalised during embedding.
Comparing those two as raw strings matches 110 of 156 and silently drops
geosmin, both carvones, limonene, linalool and 41 others, which would make the
site render its own flagship molecules as unannotated.

So the join is done here, once, with a real chemistry toolkit, and the result
is a static id map the web route can read.

    python/.venv/bin/python python/build_curated_map.py

Writes src/data/scent/curated-atlas-map.json.
"""

from __future__ import annotations

import json
from pathlib import Path

from rdkit import Chem, RDLogger

RDLogger.DisableLog("rdApp.*")

ROOT = Path(__file__).resolve().parents[1]
ATLAS = ROOT / "public" / "scent" / "atlas.json"
CURATED = ROOT / "src" / "data" / "scent" / "molecules.json"
OUT = ROOT / "src" / "data" / "scent" / "curated-atlas-map.json"


def canon(smiles: str) -> str | None:
    """Canonical SMILES, stereochemistry included.

    Chirality is kept on purpose. The two carvones differ only in an @/@@ tag
    and collapsing them here would hand both the same atlas row, which is
    exactly the blind spot the page names out loud.
    """
    mol = Chem.MolFromSmiles(smiles)
    return Chem.MolToSmiles(mol) if mol else None


def main() -> None:
    atlas = json.loads(ATLAS.read_text())
    curated = json.loads(CURATED.read_text())

    # atlas SMILES -> atlas id, canonicalised on this side too, because the
    # file was written by a different RDKit version than the one running now.
    by_canon: dict[str, str] = {}
    for m in atlas["molecules"]:
        c = canon(m["smiles"])
        if c and c not in by_canon:
            by_canon[c] = m["id"]

    mapping: dict[str, str] = {}
    missing: list[str] = []
    for m in curated:
        c = canon(m["smiles"])
        if c is None:
            missing.append(f"{m['id']} (unparseable SMILES)")
            continue
        hit = by_canon.get(c)
        if hit:
            mapping[m["id"]] = hit
        else:
            missing.append(m["id"])

    OUT.write_text(
        json.dumps(
            {
                "note": (
                    "curated molecule id -> atlas molecule id, joined on canonical "
                    "SMILES. Built by python/build_curated_map.py."
                ),
                "matched": len(mapping),
                "curated": len(curated),
                "map": mapping,
                "notInAtlas": sorted(missing),
            },
            indent=1,
        )
        + "\n"
    )

    print(f"  matched {len(mapping)}/{len(curated)} curated molecules to atlas rows")
    if missing:
        print(f"  genuinely absent from GS-LF ({len(missing)}):")
        for m in sorted(missing):
            print(f"    {m}")


if __name__ == "__main__":
    main()
