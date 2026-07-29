"""Second pass: the specific questions the loader depends on."""

from collections import Counter

import pyrfume
import pandas as pd

# 1. Is leffingwell's behavior index the same key as its molecules index?
lm = pyrfume.load_data("leffingwell/molecules.csv")
lb = pyrfume.load_data("leffingwell/behavior.csv")
try:
    ls = pyrfume.load_data("leffingwell/stimuli.csv")
    print(f"leffingwell/stimuli.csv shape={ls.shape} cols={list(ls.columns)}")
    print(ls.head(3).to_string())
except Exception as e:
    print(f"leffingwell stimuli: {type(e).__name__}: {e}")

print(f"\nleffingwell behavior index sample: {list(lb.index[:3])}")
print(f"leffingwell molecules index sample: {list(lm.index[:3])}")
print(f"index sets equal? {set(lb.index) == set(lm.index)}")
print(f"behavior values unique: {sorted(pd.unique(lb.values.ravel()))[:6]}")

# 2. GoodScents descriptor tokens
gb = pyrfume.load_data("goodscents/behavior.csv")
gs = pyrfume.load_data("goodscents/stimuli.csv")
tokens = Counter()
for s in gb["Descriptors"].dropna():
    for t in str(s).split(";"):
        t = t.strip().lower()
        if t:
            tokens[t] += 1
print(f"\ngoodscents distinct descriptor tokens: {len(tokens)}")
print(f"  top 25: {tokens.most_common(25)}")
print(f"  tokens with >=30 support: {sum(1 for v in tokens.values() if v >= 30)}")

leff_labels = set(c.strip().lower() for c in lb.columns)
overlap = set(tokens) & leff_labels
print(f"\nleffingwell labels: {len(leff_labels)}")
print(f"  shared with goodscents tokens: {len(overlap)}")
print(f"  goodscents-only with >=30 support: "
      f"{sorted([t for t, v in tokens.items() if v >= 30 and t not in leff_labels])[:30]}")

# 3. Snitz: how many pairs are single-molecule on BOTH sides?
sb = pyrfume.load_data("snitz_2013/behavior.csv")
def is_single(x):
    return "," not in str(x)
singles = sb[sb["StimulusA"].map(is_single) & sb["StimulusB"].map(is_single)]
print(f"\nsnitz pairs total: {len(sb)}")
print(f"  single-vs-single: {len(singles)}")
print(f"  similarity range: {sb['Similarity'].min():.1f} .. {sb['Similarity'].max():.1f}")
print(singles.head(5).to_string())

sm = pyrfume.load_data("snitz_2013/molecules.csv")
have = set(sm.index.astype(str))
usable = sum(
    1 for _, r in singles.iterrows()
    if str(r["StimulusA"]) in have and str(r["StimulusB"]) in have
)
print(f"  single pairs with SMILES on both sides: {usable}")

# 4. How big is the merged molecule set?
gs_cids = set(gs["CID"].dropna().astype(int))
lf_cids = set(int(c) for c in lm.index)
print(f"\ngoodscents CIDs: {len(gs_cids)}  leffingwell CIDs: {len(lf_cids)}")
print(f"  union: {len(gs_cids | lf_cids)}  intersection: {len(gs_cids & lf_cids)}")
