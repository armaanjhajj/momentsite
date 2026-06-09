import type { ReactNode } from "react";

/**
 * Inline term with an asterisk and a hover/focus tooltip. Pure CSS popup, so it
 * works inside server components. The note text stays in the DOM so screen
 * readers and keyboard users get it too (the span is focusable).
 */
export function Footnote({
  children,
  note,
}: {
  children: ReactNode;
  note: string;
}) {
  return (
    <span className="footnote" tabIndex={0}>
      {children}
      <sup className="footnote-mark" aria-hidden="true">
        *
      </sup>
      <span className="footnote-pop" role="tooltip">
        {note}
      </span>
    </span>
  );
}
