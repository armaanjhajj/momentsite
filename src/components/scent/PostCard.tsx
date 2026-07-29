import type { ScentPost } from "@/lib/scent/board";
import { formatCode } from "@/lib/scent/msi";
import { descriptorColor, descriptorLabel } from "@/data/scent/descriptors";
import { ShareButton } from "./ShareButton";

/** "3 days ago", without pulling in a date library for six lines of work. */
function ago(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const units: Array<[number, string]> = [
    [60, "minute"],
    [3600, "hour"],
    [86400, "day"],
    [604800, "week"],
  ];
  let last = units[0];
  for (const u of units) if (s >= u[0]) last = u;
  const n = Math.floor(s / last[0]);
  return `${n} ${last[1]}${n === 1 ? "" : "s"} ago`;
}

function topThree(profile: Record<string, number>) {
  return Object.entries(profile ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
}

export function PostCard({
  post,
  index = 0,
}: {
  post: ScentPost;
  /** stagger position, so a feed arrives in order rather than all at once */
  index?: number;
}) {
  const label = formatCode(post.code);
  const chips = topThree(post.profile);
  const lead = post.molecules?.[0];

  return (
    <article
      id={`p-${post.id}`}
      className="scent-post"
      style={{ animationDelay: `${Math.min(index, 11) * 0.045}s` }}
    >
      <header className="scent-post-head">
        <span className="scent-post-code">{label}</span>
        <span className="scent-post-region">{post.sub}</span>
        {typeof post.similarity === "number" && (
          <span className="scent-post-match">
            {Math.round(Math.max(0, post.similarity) * 100)}% match
          </span>
        )}
        <time className="scent-post-time" dateTime={post.created_at}>
          {ago(post.created_at)}
        </time>
      </header>

      {/* The subject line, then the body. Same two fields as the box it was
          written in, in the same order. */}
      <h4 className="scent-post-title">{post.query}</h4>
      <p className="scent-post-memory">{post.memory}</p>

      <footer className="scent-post-foot">
        <span className="scent-post-chips">
          {chips.map(([id, w]) => (
            <span
              key={id}
              className="scent-post-chip"
              style={{
                borderColor: descriptorColor(id, 0.4),
                color: descriptorColor(id, 0.95),
              }}
            >
              {descriptorLabel(id)}
              <span className="scent-post-chip-w">{w.toFixed(2)}</span>
            </span>
          ))}
          {lead && <span className="scent-post-mol">{lead.name}</span>}
        </span>

        <ShareButton
          compact
          path={`/board#p-${post.id}`}
          title={`MSI ${label}`}
          text={post.query}
          label="Share this memory"
        />
      </footer>
    </article>
  );
}
