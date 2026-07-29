"""SMILES -> graph.

Atoms are nodes, bonds are edges. That is literally what a molecule is, which
is why graph nets are the natural family here rather than a clever choice.

Two things in this file exist specifically to be ablated:

  * CHIRALITY TAGS on atom features. Without them the model provably cannot
    separate (R)- from (S)-carvone. With them it has a weak signal (a CIP tag)
 is not 3D geometry, so the honest expectation is "still mostly fails, but
    now measurably". `--audit-stereo` in train.py reports it either way.

  * GLOBAL RDKIT DESCRIPTORS concatenated at readout. 5,000 molecules is small;
    handing the model physicochemical priors it would otherwise have to learn
    is one of the two standard ways to stretch it (the other being
    self-supervised pretraining on ZINC/PubChem).
"""

from __future__ import annotations

import numpy as np
import torch
from rdkit import Chem, RDLogger
from rdkit.Chem import Descriptors, rdMolDescriptors
from torch_geometric.data import Data

RDLogger.DisableLog("rdApp.*")

ATOMS = ["C", "N", "O", "S", "P", "F", "Cl", "Br", "I", "Si", "B", "Se"]
HYBRIDIZATIONS = [
    Chem.rdchem.HybridizationType.SP,
    Chem.rdchem.HybridizationType.SP2,
    Chem.rdchem.HybridizationType.SP3,
    Chem.rdchem.HybridizationType.SP3D,
    Chem.rdchem.HybridizationType.SP3D2,
]
CHIRAL_TAGS = [
    Chem.rdchem.ChiralType.CHI_UNSPECIFIED,
    Chem.rdchem.ChiralType.CHI_TETRAHEDRAL_CW,
    Chem.rdchem.ChiralType.CHI_TETRAHEDRAL_CCW,
    Chem.rdchem.ChiralType.CHI_OTHER,
]
BOND_TYPES = [
    Chem.rdchem.BondType.SINGLE,
    Chem.rdchem.BondType.DOUBLE,
    Chem.rdchem.BondType.TRIPLE,
    Chem.rdchem.BondType.AROMATIC,
]
BOND_STEREO = [
    Chem.rdchem.BondStereo.STEREONONE,
    Chem.rdchem.BondStereo.STEREOZ,
    Chem.rdchem.BondStereo.STEREOE,
]

# Cheap, well-understood, and directly relevant to whether a molecule is
# volatile enough to smell of anything at all.
GLOBAL_DESCRIPTORS = [
    ("MolWt", Descriptors.MolWt),
    ("LogP", Descriptors.MolLogP),
    ("TPSA", Descriptors.TPSA),
    ("NumHDonors", Descriptors.NumHDonors),
    ("NumHAcceptors", Descriptors.NumHAcceptors),
    ("NumRotatableBonds", Descriptors.NumRotatableBonds),
    ("RingCount", lambda m: rdMolDescriptors.CalcNumRings(m)),
    ("FractionCSP3", Descriptors.FractionCSP3),
    ("HeavyAtomCount", lambda m: float(m.GetNumHeavyAtoms())),
    ("MolMR", Descriptors.MolMR),
]

ATOM_DIM = (
    len(ATOMS) + 1          # element one-hot + other
    + 6                     # degree
    + 5                     # formal charge
    + len(HYBRIDIZATIONS) + 1
    + 1                     # aromatic
    + 1                     # in ring
    + 5                     # total num H
    + len(CHIRAL_TAGS)      # <- the stereochemistry arm
)
BOND_DIM = len(BOND_TYPES) + 1 + len(BOND_STEREO) + 2  # + conjugated + in ring
GLOBAL_DIM = len(GLOBAL_DESCRIPTORS)


def _one_hot(value, choices: list, allow_other: bool = True) -> list[float]:
    vec = [0.0] * (len(choices) + (1 if allow_other else 0))
    try:
        vec[choices.index(value)] = 1.0
    except ValueError:
        if allow_other:
            vec[-1] = 1.0
    return vec


def atom_features(atom: Chem.Atom, use_chirality: bool = True) -> list[float]:
    feats = (
        _one_hot(atom.GetSymbol(), ATOMS)
        + _one_hot(atom.GetDegree(), [0, 1, 2, 3, 4], allow_other=True)
        + _one_hot(atom.GetFormalCharge(), [-2, -1, 0, 1, 2], allow_other=False)
        + _one_hot(atom.GetHybridization(), HYBRIDIZATIONS)
        + [float(atom.GetIsAromatic())]
        + [float(atom.IsInRing())]
        + _one_hot(atom.GetTotalNumHs(), [0, 1, 2, 3, 4], allow_other=False)
    )
    # Zeroing rather than omitting keeps ATOM_DIM constant across the ablation,
    # so both arms share a checkpoint shape and the comparison is clean.
    if use_chirality:
        feats += _one_hot(atom.GetChiralTag(), CHIRAL_TAGS, allow_other=False)
    else:
        feats += [0.0] * len(CHIRAL_TAGS)
    return feats


def bond_features(bond: Chem.Bond) -> list[float]:
    return (
        _one_hot(bond.GetBondType(), BOND_TYPES)
        + _one_hot(bond.GetStereo(), BOND_STEREO, allow_other=False)
        + [float(bond.GetIsConjugated()), float(bond.IsInRing())]
    )


def global_features(mol: Chem.Mol) -> list[float]:
    out = []
    for _, fn in GLOBAL_DESCRIPTORS:
        try:
            out.append(float(fn(mol)))
        except Exception:
            out.append(0.0)
    return out


def featurize(
    smiles: str,
    label: np.ndarray | None = None,
    use_chirality: bool = True,
    use_global: bool = True,
) -> Data | None:
    """One molecule -> one PyG graph. Returns None on unparseable SMILES."""
    mol = Chem.MolFromSmiles(smiles)
    if mol is None or mol.GetNumAtoms() == 0:
        return None

    Chem.AssignStereochemistry(mol, cleanIt=True, force=True)

    x = torch.tensor(
        [atom_features(a, use_chirality) for a in mol.GetAtoms()], dtype=torch.float
    )

    src, dst, attrs = [], [], []
    for bond in mol.GetBonds():
        i, j = bond.GetBeginAtomIdx(), bond.GetEndAtomIdx()
        bf = bond_features(bond)
    # Undirected graph as two directed edges. Message passing needs both.
        src += [i, j]
        dst += [j, i]
        attrs += [bf, bf]

    if not src:  # single atom, no bonds
        edge_index = torch.zeros((2, 0), dtype=torch.long)
        edge_attr = torch.zeros((0, BOND_DIM), dtype=torch.float)
    else:
        edge_index = torch.tensor([src, dst], dtype=torch.long)
        edge_attr = torch.tensor(attrs, dtype=torch.float)

    data = Data(x=x, edge_index=edge_index, edge_attr=edge_attr)
    data.smiles = smiles
    data.u = torch.tensor(
        [global_features(mol) if use_global else [0.0] * GLOBAL_DIM], dtype=torch.float
    )
    if label is not None:
        data.y = torch.tensor(label, dtype=torch.float).unsqueeze(0)
    return data


def featurize_all(
    smiles: list[str],
    labels: np.ndarray | None = None,
    use_chirality: bool = True,
    use_global: bool = True,
) -> tuple[list[Data], list[int]]:
    """Returns (graphs, indices_kept). RDKit rejects a small number of SMILES."""
    graphs, kept = [], []
    for i, smi in enumerate(smiles):
        label = labels[i] if labels is not None else None
        g = featurize(smi, label, use_chirality, use_global)
        if g is not None:
            graphs.append(g)
            kept.append(i)
    return graphs, kept


def enantiomer_pairs(smiles: list[str]) -> list[tuple[int, int]]:
    """Find index pairs that differ only in stereochemistry.

    These are the cases a 2D graph net cannot separate. Used by the stereo
 audit. Carvone is the famous one, but the set is bigger than that.
    """
    flat: dict[str, list[int]] = {}
    for i, smi in enumerate(smiles):
        mol = Chem.MolFromSmiles(smi)
        if mol is None:
            continue
        key = Chem.MolToSmiles(mol, isomericSmiles=False)
        flat.setdefault(key, []).append(i)

    pairs = []
    for idxs in flat.values():
        if len(idxs) < 2:
            continue
        for a in range(len(idxs)):
            for b in range(a + 1, len(idxs)):
                if smiles[idxs[a]] != smiles[idxs[b]]:
                    pairs.append((idxs[a], idxs[b]))
    return pairs
