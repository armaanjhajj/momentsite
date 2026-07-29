import type { Metadata } from "next";
import { ExhibitClose } from "@/components/ExhibitClose";
import { Crumbs } from "@/components/scent/Crumbs";
import { SensePicker } from "@/components/scent/SensePicker";
import { PostCard } from "@/components/scent/PostCard";
import { recentPosts, totalPosts } from "@/lib/scent/board";

// The board accumulates, so it is never cached. A board one memory stale is
// a board that lost the memory somebody just shared.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Board",
  description:
    "Every memory shared to the Moments Sense Index, filed by the code its smell landed on.",
};

export default async function Index() {
  const [posts, total] = await Promise.all([recentPosts(60), totalPosts()]);

  return (
    <main className="scent-page">
      <ExhibitClose />

          <header className="scent-hero board-hero">
        <Crumbs
          items={[
            { label: "Artifacts", href: "/artifacts" },
            { label: "Board", href: "/board" },
          ]}
        />
        <h1 className="scent-title">THE BOARD</h1>
        <p className="scent-tagline">Every memory anyone has described.</p>

        <div className="board-meta">
          <span className="board-count">
            <strong>{total.toLocaleString()}</strong>
            {total === 1 ? "memory" : "memories"}
          </span>

          <SensePicker />
        </div>
      </header>

      <section className="board-section">
        {total === 0 ? (
          <p className="board-empty">
            Nothing has been shared yet. The first memory sets the first
            address.
          </p>
        ) : (
          <div className="board-feed">
            {posts.map((p, i) => (
              <PostCard key={p.id} post={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
