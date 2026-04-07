"use client";

import { useState, useCallback } from "react";

const IMAGES = [
  "/about/1.png",
  "/about/2.png",
  "/about/3.png",
  "/about/4.png",
  "/about/5.png",
  "/about/6.png",
  "/about/7.png",
];

export function AboutGallery() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % IMAGES.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length);
  }, []);

  return (
    <div className="gallery">
      <div className="gallery-row">
        <button
          type="button"
          className="gallery-arrow"
          onClick={prev}
          aria-label="Previous"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="gallery-stage">
          {IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`Moments ${i + 1}`}
              className={`gallery-image ${i === index ? "active" : ""}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="gallery-arrow"
          onClick={next}
          aria-label="Next"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="gallery-dots">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`gallery-dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
