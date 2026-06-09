import Link from "next/link";

// Top-right dismiss shared by artifact subpages — always routes back to the
// artifacts index rather than deeper into the site.
export function ExhibitClose() {
  return (
    <Link
      href="/exhibits"
      className="exhibit-close"
      aria-label="Back to artifacts"
    >
      &times;
    </Link>
  );
}
