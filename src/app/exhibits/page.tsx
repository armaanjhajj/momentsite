"use client";

import { useState } from "react";
import Link from "next/link";
import { KnowledgeGraph } from "@/components/KnowledgeGraph";
import { ExhibitModal, type ExhibitContent } from "@/components/ExhibitModal";
import { LegacyModal } from "@/components/LegacyModal";

type Exhibit = {
  title: string;
  href?: string;
  external?: boolean;
  // static: href points at a non-router static page (served from /public),
  // so it needs a hard navigation rather than a client-side <Link>.
  static?: boolean;
  action?: "graph";
  // modal: key into the content map — opens an in-page blurb + media popup.
  modal?: string;
};

// #0 … #N — live exhibits. Items with an href navigate, items with an action
// or modal open something in-page; the rest are listed but not up yet.
const EXHIBITS: Exhibit[] = [
  { title: "IMPULSE", modal: "impulse" },
  { title: "DOOR", modal: "door" },
  { title: "ORG", modal: "org" },
  { title: "VIDEOS", modal: "videos" },
  { title: "APP?BETA(S)", modal: "beta" },
  { title: "KUPIDEVENT", modal: "kupid" },
  { title: "PARTIES", modal: "parties" },
  { title: "GLASSES", href: "/glasses", static: true },
  { title: "VTKICKBACK", href: "/events/vt-kickback" },
  { title: "KNOWLEDGEGRAPH", action: "graph" },
];

// Next up — teased, not clickable.
const NEXT_TITLE = "??????????";

const pad = (n: number) => String(n).padStart(2, "0");

function ExhibitRow({
  n,
  ex,
  onActivate,
}: {
  n: number;
  ex: Exhibit;
  onActivate: () => void;
}) {
  const content = (
    <>
      <span className="exhibit-num">{pad(n)}</span>
      <span className="exhibit-title">{ex.title}</span>
    </>
  );

  // Opens something in-page (graph overlay or content modal).
  if (ex.action === "graph" || ex.modal) {
    return (
      <button
        type="button"
        className="exhibit-row exhibit-row-link"
        onClick={onActivate}
      >
        {content}
      </button>
    );
  }

  if (!ex.href) {
    return <div className="exhibit-row exhibit-row-static">{content}</div>;
  }

  if (ex.static) {
    return (
      <a href={ex.href} className="exhibit-row exhibit-row-link">
        {content}
      </a>
    );
  }

  return ex.external ? (
    <a
      href={ex.href}
      target="_blank"
      rel="noopener noreferrer"
      className="exhibit-row exhibit-row-link"
    >
      {content}
    </a>
  ) : (
    <Link href={ex.href} className="exhibit-row exhibit-row-link">
      {content}
    </Link>
  );
}

export default function Exhibits() {
  const [graphOpen, setGraphOpen] = useState(false);
  const [modalKey, setModalKey] = useState<string | null>(null);
  const [legacyOpen, setLegacyOpen] = useState(false);

  // Defined in render so blurbs can wire inline links to local state.
  const CONTENT: Record<string, ExhibitContent> = {
    door: {
      title: "DOOR",
      blurb:
        "we had to get our name out there somehow sooooo.. we painted an obnoxious pink door as a photo op and showcased it during the rutgers involvement fair! it was actually a pretty cool experience cus people came and left notes on it and took pictures and even posted about it.",
      media: [
        { type: "image", src: "/exhibits/door/0.jpg", alt: "The pink door at the Rutgers involvement fair" },
        { type: "image", src: "/exhibits/door/1.jpg", alt: "The pink door" },
        { type: "image", src: "/exhibits/door/2.jpg", alt: "The pink door" },
        { type: "image", src: "/exhibits/door/3.jpg", alt: "The pink door" },
      ],
    },
    impulse: {
      title: "IMPULSE",
      blurb:
        "impulse was our initial approach at all this... the name was supposed to encourage people to be impulsive again and just go up to people and talk; the worlds too isolated to be scared to talk to people nowadays. it now remains a subsidiary of moments, project remains under work.",
      media: [
        { type: "image", src: "/exhibits/impulse/logo.png", alt: "Impulse logo" },
        { type: "video", src: "/exhibits/impulse/clip.mp4" },
        { type: "image", src: "/exhibits/impulse/1.jpg", alt: "Impulse" },
        { type: "image", src: "/exhibits/impulse/3-1.jpg", alt: "Impulse" },
        { type: "image", src: "/exhibits/impulse/3-2.jpg", alt: "Impulse" },
        { type: "image", src: "/exhibits/impulse/3-3.jpg", alt: "Impulse" },
      ],
    },
    org: {
      title: "ORG",
      blurb: (
        <>
          semester F25 we made our first attempt at turning moments into an org
          here at rutgers. it was unforgettable and we&apos;re so grateful for
          the{" "}
          <button
            type="button"
            className="exhibit-modal-inline-link"
            onClick={() => setLegacyOpen(true)}
          >
            team
          </button>{" "}
          of friends that gave us a shot. we did some fun events and made even
          funnier videos.
        </>
      ),
      media: [{ type: "image", src: "/exhibits/org/org.png", alt: "Moments org" }],
    },
    videos: {
      title: "VIDEOS",
      blurb: (
        <>
          earlier last year us and our legacy F25 cohort made some funny videos
          to sort of deviate from the super suffocating start up media runs
          flooding social media. they gained a surprising amount of traction
          (2.5M+ cumm. views) which we&apos;re super thankful for. some are
          still up on our{" "}
          <a
            href="https://tiktok.com/@letsmakemoments"
            target="_blank"
            rel="noopener noreferrer"
            className="exhibit-modal-inline-link"
          >
            tiktok
          </a>{" "}
          if you&apos;d like to check them out :)
        </>
      ),
      media: [
        { type: "image", src: "/exhibits/videos/1.jpg", alt: "Moments video" },
        { type: "image", src: "/exhibits/videos/2.jpg", alt: "Moments video" },
        { type: "image", src: "/exhibits/videos/3.jpg", alt: "Moments video" },
      ],
    },
    beta: {
      title: "APP?BETA(S)",
      blurb:
        "we launched a few beta versions of an app we're still working on! we got so much support that we're forever grateful for and our team is hard at work trying to build our version of the best platform to meet people on.",
      media: [
        { type: "image", src: "/exhibits/betaapp/1.jpg", alt: "Moments app beta" },
        { type: "image", src: "/exhibits/betaapp/2.jpg", alt: "Moments app beta" },
        { type: "image", src: "/exhibits/betaapp/3.jpg", alt: "Moments app beta" },
        { type: "image", src: "/exhibits/betaapp/4.jpg", alt: "Moments app beta" },
      ],
    },
    parties: {
      title: "PARTIES",
      blurb:
        "we hosted a series of 5 parties partnering with on-campus fraternities to do what we do best: make moments!",
      media: [
        { type: "image", src: "/exhibits/parties/1.jpg", alt: "Moments party" },
        { type: "image", src: "/exhibits/parties/2.jpg", alt: "Moments party" },
        { type: "image", src: "/exhibits/parties/3.jpg", alt: "Moments party" },
        { type: "image", src: "/exhibits/parties/4.jpg", alt: "Moments party" },
      ],
    },
    kupid: {
      title: "KUPIDEVENT",
      blurb: (
        <>
          we had the awesome opportunity to co-host a live talkshow with the
          team at kupid and even run a live beta pilot to demo our app. feel
          free to check out that event on{" "}
          <a
            href="https://instagram.com/kupiddating"
            target="_blank"
            rel="noopener noreferrer"
            className="exhibit-modal-inline-link"
          >
            their instagram
          </a>{" "}
          @kupiddating
        </>
      ),
      media: [],
    },
  };

  const activate = (ex: Exhibit) => {
    if (ex.action === "graph") setGraphOpen(true);
    else if (ex.modal) setModalKey(ex.modal);
  };

  return (
    <div className="exhibits-page">
      <div className="exhibits-list">
        {EXHIBITS.map((ex, i) => (
          <ExhibitRow key={ex.title} n={i} ex={ex} onActivate={() => activate(ex)} />
        ))}

        <div className="exhibit-row exhibit-row-next">
          <span className="exhibit-num">{pad(EXHIBITS.length)}</span>
          <span className="exhibit-title">{NEXT_TITLE}</span>
          <span className="exhibit-nextlabel">NEXT UP</span>
        </div>
      </div>

      {/* Concept map — opens as a full-screen overlay over the list */}
      <KnowledgeGraph
        open={graphOpen}
        onClose={() => setGraphOpen(false)}
        renderTrigger={false}
      />

      {/* Blurb + media popups (door, impulse, org, videos) */}
      <ExhibitModal
        content={modalKey ? CONTENT[modalKey] : null}
        onClose={() => setModalKey(null)}
      />

      {/* Legacy roster — same popup as the team page, opened from ORG's blurb */}
      <LegacyModal open={legacyOpen} onClose={() => setLegacyOpen(false)} />
    </div>
  );
}
