"""The network.

A directed message-passing net (D-MPNN, the Chemprop family) with a
multi-label descriptor head.

The important method is `embed()`, not `forward()`. The classifier exists only
to force the network to build a useful internal representation of a molecule;
once trained, the head is discarded and the penultimate layer becomes the odor
map. Same trick as a face-recognition model quietly learning a face space on
the way to naming people.
"""

from __future__ import annotations

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import global_add_pool, global_mean_pool
from torch_geometric.utils import scatter

from .featurize import ATOM_DIM, BOND_DIM, GLOBAL_DIM


class DMPNNLayer(nn.Module):
    """Messages live on directed edges rather than nodes.

    Passing on edges avoids the totters a node-centric net produces (a message
    bouncing straight back down the bond it arrived on), which matters on the
    small rings that dominate odorant chemistry.
    """

    def __init__(self, hidden: int):
        super().__init__()
        self.lin = nn.Linear(hidden, hidden)

    def forward(
        self,
        h_edge: torch.Tensor,
        edge_index: torch.Tensor,
        rev_index: torch.Tensor,
        h0: torch.Tensor,
        num_nodes: int,
    ) -> torch.Tensor:
        src, dst = edge_index

        # num_nodes must be passed in, not inferred from dst.max(): a node with
        # no incoming edges never appears in dst, and inferring would silently
        # size the buffer short and misalign every subsequent gather.
        node_msg = scatter(h_edge, dst, dim=0, dim_size=num_nodes, reduce="sum")
        # message along edge (u->v) = sum of messages into u, minus the reverse
        # edge (v->u), so information does not immediately return whence it came
        msg = node_msg[src] - h_edge[rev_index]

        return F.relu(h0 + self.lin(msg))


class ScentNet(nn.Module):
    def __init__(
        self,
        num_labels: int,
        hidden: int = 300,
        depth: int = 4,
        embedding_dim: int = 256,
        dropout: float = 0.15,
        use_global: bool = True,
    ):
        super().__init__()
        self.use_global = use_global
        self.embedding_dim = embedding_dim

        self.edge_init = nn.Linear(ATOM_DIM + BOND_DIM, hidden)
        self.layers = nn.ModuleList([DMPNNLayer(hidden) for _ in range(depth)])
        self.node_out = nn.Linear(ATOM_DIM + hidden, hidden)

        readout_dim = hidden * 2 + (GLOBAL_DIM if use_global else 0)

        # The penultimate layer. Everything the project is about lives here.
        self.embed_head = nn.Sequential(
            nn.Linear(readout_dim, hidden),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden, embedding_dim),
        )

        # Disposable.
        self.classifier = nn.Linear(embedding_dim, num_labels)

    def embed(self, data) -> torch.Tensor:
        """Molecule -> point in odor space. The actual artifact."""
        x, edge_index, edge_attr = data.x, data.edge_index, data.edge_attr
        batch = data.batch if hasattr(data, "batch") else torch.zeros(
            x.size(0), dtype=torch.long, device=x.device
        )

        if edge_index.numel() == 0:
            # Lone atom: no messages to pass, fall back to the node features.
            node_h = F.relu(self.node_out(torch.cat([x, torch.zeros(
                x.size(0), self.node_out.in_features - x.size(1), device=x.device
            )], dim=1)))
        else:
            src, dst = edge_index
            h0 = F.relu(self.edge_init(torch.cat([x[src], edge_attr], dim=1)))
            h = h0

            rev_index = self._reverse_index(edge_index)
            for layer in self.layers:
                h = layer(h, edge_index, rev_index, h0, x.size(0))

            agg = scatter(h, dst, dim=0, dim_size=x.size(0), reduce="sum")
            node_h = F.relu(self.node_out(torch.cat([x, agg], dim=1)))

        pooled = torch.cat([global_mean_pool(node_h, batch), global_add_pool(node_h, batch)], dim=1)

        if self.use_global:
            u = data.u.view(pooled.size(0), -1)
            pooled = torch.cat([pooled, u], dim=1)

        # L2-normalised so cosine similarity is a dot product, matching what
        # the web front end expects from embedding.json.
        return F.normalize(self.embed_head(pooled), p=2, dim=1)

    def forward(self, data) -> torch.Tensor:
        return self.classifier(self.embed(data))

    @staticmethod
    def _reverse_index(edge_index: torch.Tensor) -> torch.Tensor:
        """Index of the reverse edge for each directed edge.

        featurize.py emits bonds as adjacent (i->j, j->i) pairs, so the reverse
        of edge 2k is 2k+1 and vice versa.
        """
        n = edge_index.size(1)
        idx = torch.arange(n, device=edge_index.device)
        return idx ^ 1


class FocalLoss(nn.Module):
    """Multi-label focal loss.

    "Fruity" has thousands of positives and "metallic" has a dozen. Plain BCE
    lets the model predict the head labels for everything and still score well
 on accuracy. Focal loss down-weights the easy, abundant negatives so the
    tail contributes gradient at all.
    """

    def __init__(self, gamma: float = 2.0, pos_weight: torch.Tensor | None = None):
        super().__init__()
        self.gamma = gamma
        self.register_buffer("pos_weight", pos_weight if pos_weight is not None else torch.tensor(1.0))

    def forward(self, logits: torch.Tensor, targets: torch.Tensor) -> torch.Tensor:
        bce = F.binary_cross_entropy_with_logits(
            logits, targets, reduction="none", pos_weight=self.pos_weight
        )
        p_t = torch.exp(-bce.clamp(max=20))
        return ((1 - p_t) ** self.gamma * bce).mean()
