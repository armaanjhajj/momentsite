import TallyLoader from "./TallyLoader";

export const metadata = {
  title: "Student Connection Survey",
  description: "Understanding Campus Friendship & Belonging",
};

export default function SurveyPage() {
  return (
    <main>
      <section className="container py-8">
        <div className="rounded-2xl border border-white/10 bg-white p-4">
          <div className="relative max-w-5xl mx-auto">
            <iframe
              data-tally-src="https://tally.so/embed/wa70BX?alignLeft=1&transparentBackground=1&dynamicHeight=1"
              loading="lazy"
              width="100%"
              height="200"
              frameBorder={0}
              marginHeight={0}
              marginWidth={0}
              title="Student Connection Survey: Understanding Campus Friendship & Belonging"
              className="w-full border-0"
            />
          </div>
        </div>
      </section>
      <TallyLoader />
    </main>
  );
}


