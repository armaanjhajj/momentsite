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
  /**
   * A plain string for a one-line aside, or elements when the note needs a
   * title and structure. Widening from `string` is backward compatible, since
   * every existing caller passes a string and a string is a valid ReactNode.
   */
  note: ReactNode;
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
