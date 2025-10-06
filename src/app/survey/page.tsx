import TallyLoader from "./TallyLoader";

export const metadata = {
  title: "Student Connection Survey",
  description: "Understanding Campus Friendship & Belonging",
};

export default function SurveyPage() {
  return (
    <main>
      <div className="fixed inset-0 z-[200] bg-[#f3f4f6]">
        <iframe
          data-tally-src="https://tally.so/embed/wa70BX?alignLeft=1&dynamicHeight=1"
          loading="lazy"
          width="100%"
          height="100%"
          className="w-full h-full border-0"
          frameBorder={0}
          marginHeight={0}
          marginWidth={0}
          title="Student Connection Survey: Understanding Campus Friendship & Belonging"
        />
      </div>
      <TallyLoader />
    </main>
  );
}


