import TallyLoader from "./TallyLoader";

export const metadata = {
  title: "Student Connection Survey",
  description: "Understanding Campus Friendship & Belonging",
};

export default function SurveyPage() {
  return (
    <main>
      <section className="container py-8">
        <header className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-semibold">Academic Public Health Survey</h1>
          <p className="mt-2 text-white/70">Student Connection Survey: Understanding Campus Friendship & Belonging</p>
        </header>
        <hr className="mt-6 border-neutral-800" />
        <div className="mt-8 rounded-2xl border border-neutral-800 bg-white p-4">
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


