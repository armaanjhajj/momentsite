import Script from "next/script";

export const metadata = {
  title: "Student Connection Survey",
  description: "Understanding Campus Friendship & Belonging",
};

export default function SurveyPage() {
  return (
    <main>
      <section className="container pt-10 pb-16 md:pt-14">
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <iframe
            data-tally-src="https://tally.so/embed/wa70BX?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            loading="lazy"
            width="100%"
            height="714"
            frameBorder={0}
            marginHeight={0}
            marginWidth={0}
            title="Student Connection Survey: Understanding Campus Friendship & Belonging"
          />
        </div>
      </section>

      <Script id="tally-embed-loader" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html:
          'var d=document,w="https://tally.so/widgets/embed.js",v=function(){typeof Tally!="undefined"?Tally.loadEmbeds():d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach(function(e){e.src=e.dataset.tallySrc})};if(typeof Tally!="undefined")v();else if(d.querySelector("script[src=\""+w+"\"]")==null){var s=d.createElement("script");s.src=w,s.onload=v,s.onerror=v,d.body.appendChild(s);}'
      }} />
    </main>
  );
}


