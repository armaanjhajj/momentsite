import Link from "next/link";

// Top-right dismiss shared by exhibit subpages — always routes back to the
// exhibits index rather than deeper into the site.
export function ExhibitClose() {
  return (
    <Link
      href="/exhibits"
      className="exhibit-close"
      aria-label="Back to exhibits"
    >
      &times;
    </Link>
  );
}
