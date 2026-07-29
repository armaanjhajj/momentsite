import Link from "next/link";

/**
 * The path back up, in place of an eyebrow. Every step is a link, including
 * the one you are on, so the trail says where this page sits rather than just
 * naming it.
 */
export function Crumbs({
  items,
}: {
  items: Array<{ label: string; href: string }>;
}) {
  return (
    <nav className="scent-crumbs" aria-label="Breadcrumb">
      {items.map((c, i) => (
        <span key={c.href}>
          {i > 0 && <span className="scent-crumb-sep">›</span>}
          <Link
            href={c.href}
            className={`scent-crumb${i === items.length - 1 ? " scent-crumb-on" : ""}`}
            aria-current={i === items.length - 1 ? "page" : undefined}
          >
            {c.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
