#!/usr/bin/env bash
# Bootstraps the training environment.
#
# The system Python is 3.14, which has no wheels for torch / rdkit / torch-geometric
# yet, so this pins 3.11 via uv rather than fighting the resolver.
#
#   bash python/setup-env.sh
#
# Then:  source python/.venv/bin/activate

set -euo pipefail
cd "$(dirname "$0")"

if ! command -v uv >/dev/null 2>&1; then
  echo "installing uv…"
  curl -LsSf https://astral.sh/uv/install.sh | sh
  export PATH="$HOME/.local/bin:$PATH"
fi

export PATH="$HOME/.local/bin:$PATH"

echo "creating 3.11 venv…"
uv venv --python 3.11 .venv

echo "installing…"
# CPU torch: no CUDA on this machine, and the dataset is small enough that it
# does not matter much.
uv pip install --python .venv/bin/python \
  torch --index-url https://download.pytorch.org/whl/cpu

uv pip install --python .venv/bin/python \
  rdkit pyrfume pandas numpy scikit-learn scipy \
  iterative-stratification onnx

# torch-geometric must resolve after torch is present.
uv pip install --python .venv/bin/python torch-geometric

echo
echo "done. versions:"
.venv/bin/python - <<'PY'
import torch, rdkit, pyrfume, sklearn, scipy
import torch_geometric
print(f"  torch            {torch.__version__}")
print(f"  torch-geometric  {torch_geometric.__version__}")
print(f"  rdkit            {rdkit.__version__}")
print(f"  pyrfume          {pyrfume.__version__}")
print(f"  scikit-learn     {sklearn.__version__}")
PY
