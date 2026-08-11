// Unlisted. Nothing links here from the site, and this tells crawlers the
// same thing so it does not turn up in a search for the project.

export const metadata = {
  title: "SCENT v2 · semantic retrieval test",
  description:
    "A test bench for replacing the hand-authored lexicon with Cohere embeddings.",
  robots: { index: false, follow: false, nocache: true },
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return children;
}
