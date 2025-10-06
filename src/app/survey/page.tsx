import Script from "next/script";

export const metadata = {
  title: "Student Connection Survey",
  description: "Understanding Campus Friendship & Belonging",
};

export default function SurveyPage() {
  return (
    <main className="min-h-screen">
      <Script src="https://tally.so/widgets/embed.js" async />
      <iframe
        data-tally-src="https://tally.so/r/wa70BX?transparentBackground=1"
        width="100%"
        height="100%"
        className="fixed inset-0 w-screen h-screen border-0"
        frameBorder={0}
        marginHeight={0}
        marginWidth={0}
        title="Student Connection Survey: Understanding Campus Friendship & Belonging"
      />
    </main>
  );
}


