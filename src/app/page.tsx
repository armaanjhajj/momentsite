"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { KnowledgeGraph } from "@/components/KnowledgeGraph";

const DOTS = ["Top", "About", "Concept map"];

export default function Home() {
  const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const inviteRef = useRef<HTMLDivElement>(null);

  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const graphRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  // Apple-style parallax on the hero + scroll-reveal for sections below
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (imageRef.current) {
          imageRef.current.style.transform = `translateY(${y * 0.18}px) scale(${1 + y * 0.0003})`;
        }
        if (titleRef.current) {
          titleRef.current.style.transform = `translateY(${y * -0.12}px)`;
          titleRef.current.style.opacity = `${Math.max(0, 1 - y / 420)}`;
        }
        if (inviteRef.current) {
          inviteRef.current.style.opacity = `${Math.max(0, 1 - y / 160)}`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Reveal sections as they enter the viewport
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // Track which section is most in view for the dot nav
    const sections = [heroRef.current, aboutRef.current, graphRef.current];
    const ratios = new Map<Element, number>();
    const sectionIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target, e.intersectionRatio));
        let best = 0;
        let bestRatio = -1;
        sections.forEach((s, i) => {
          const r = s ? ratios.get(s) ?? 0 : 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = i;
          }
        });
        setActive(best);
      },
      { threshold: [0.2, 0.4, 0.6, 0.8] }
    );
    sections.forEach((s) => s && sectionIO.observe(s));

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      io.disconnect();
      sectionIO.disconnect();
    };
  }, []);

  function goTo(i: number) {
    const target = [heroRef.current, aboutRef.current, graphRef.current][i];
    if (i === 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <div className="home-revamp">
      {/* Section dot nav */}
      <nav className="dot-nav" aria-label="Jump to section">
        {DOTS.map((label, i) => (
          <button
            key={label}
            className={`dot ${active === i ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={label}
            aria-current={active === i}
          >
            <span className="dot-label">{label}</span>
          </button>
        ))}
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero" ref={heroRef}>
        <div className="landing-image-wrap">
          <img
            ref={imageRef}
            src="/landing.jpg"
            alt="Moments"
            className="landing-image"
          />
          <h1 ref={titleRef} className="landing-title">
            MOMENTS
          </h1>
        </div>

        <div ref={inviteRef} className="scroll-invite">
          <span className="scroll-invite-text">A tech &amp; art collective</span>
          <span className="scroll-invite-arrow" aria-hidden="true">
            ↓
          </span>
        </div>
      </section>

      {/* ── About ── */}
      <section className="about reveal" id="about" ref={aboutRef}>
        <p className="about-eyebrow">An art &amp; tech collective</p>
        <h2 className="about-headline">For people to connect.</h2>

        <div className="about-body">
          <p>
            Moments is an art and tech collective started by a{" "}
            <Link href="/team" className="about-link">
              group
            </Link>{" "}
            of friends at university. Our goal is to make cool new ways for
            people to connect. We gather like-minded people to make cool art,
            software, and tools, building new and interesting ways for people to
            make friends and actually connect.
          </p>
          <p>
            We&apos;re about a year young (est. 2025) and we&apos;ve been doing
            some pretty{" "}
            <Link href="/exhibits" className="about-link">
              interesting stuff
            </Link>{" "}
            so far. Our goal now is to expand our team to people who share a
            similar vision, so we can keep making connecting easier and the
            world feel smaller.
          </p>
          <p>
            We&apos;re working on some pretty cool stuff, so if you wanna learn
            more or be part of the mission,{" "}
            <Link href="/contact" className="about-link">
              give us a shout.
            </Link>
          </p>
        </div>
      </section>

      {/* ── Knowledge graph ── */}
      <section className="graph-section reveal" ref={graphRef}>
        <h2 className="graph-section-title">View concept map</h2>
        <KnowledgeGraph />
      </section>
    </div>
  );
}
