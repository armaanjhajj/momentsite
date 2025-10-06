import TallyLoader from "./TallyLoader";

export const metadata = {
  title: "Student Connection Survey",
  description: "Understanding Campus Friendship & Belonging",
};

export default function SurveyPage() {
  return (
    <main>
      <section className="container pt-10 pb-16 md:pt-14">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white shadow-xl overflow-hidden">
          <iframe
            data-tally-src="https://tally.so/embed/wa70BX?alignLeft=1&dynamicHeight=1&transparentBackground=1"
            loading="lazy"
            width="100%"
            height="900"
            frameBorder={0}
            marginHeight={0}
            marginWidth={0}
            title="Student Connection Survey: Understanding Campus Friendship & Belonging"
          />
        </div>
      </section>
      <TallyLoader />
    </main>
  );
}


