"use client";
import Script from "next/script";

export default function Team() {
  return (
    <main className="bg-background">
      <section className="container py-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
          {/* Tally standard embed inside a normal flow container */}
          <div className="relative max-w-5xl mx-auto">
            <iframe
              data-tally-src="https://tally.so/embed/3XXE44?alignLeft=1&transparentBackground=1&dynamicHeight=1&formEventsForwarding=1"
              loading="lazy"
              width="100%"
              height="200"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="Moments — Creative & Developer Internship Application"
              className="w-full border-0"
            />
          </div>
        </div>
      </section>
      <Script id="tally-embed" strategy="afterInteractive">
        {`(function(){var d=document,w="https://tally.so/widgets/embed.js",v=function(){if(typeof Tally!=="undefined"){Tally.loadEmbeds()}else{d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach(function(e){e.src=e.dataset.tallySrc})}};if(typeof Tally!=="undefined"){v()}else if(d.querySelector('script[src="'+w+'"]')==null){var s=d.createElement("script");s.src=w;s.onload=v;s.onerror=v;d.body.appendChild(s);}})();`}
      </Script>
    </main>
  );
}


