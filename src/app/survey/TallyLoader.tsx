"use client";

import { useEffect } from "react";

export default function TallyLoader() {
  useEffect(() => {
    const win = window as any;

    const initializeEmbeds = () => {
      if (typeof win.Tally !== "undefined" && win.Tally?.loadEmbeds) {
        win.Tally.loadEmbeds();
        return;
      }
      document
        .querySelectorAll<HTMLIFrameElement>("iframe[data-tally-src]:not([src])")
        .forEach((el) => {
          const src = el.getAttribute("data-tally-src");
          if (src && !el.src) el.src = src;
        });
    };

    if (typeof win.Tally !== "undefined") {
      initializeEmbeds();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://tally.so/widgets/embed.js"]'
    );

    if (existing) {
      const onLoad = () => initializeEmbeds();
      const onError = () => initializeEmbeds();
      existing.addEventListener("load", onLoad);
      existing.addEventListener("error", onError);
      return () => {
        existing.removeEventListener("load", onLoad);
        existing.removeEventListener("error", onError);
      };
    }

    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    script.onload = () => initializeEmbeds();
    script.onerror = () => initializeEmbeds();
    document.body.appendChild(script);

    return () => {
      // no-op cleanup
    };
  }, []);

  return null;
}


