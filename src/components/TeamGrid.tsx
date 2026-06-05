"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { LegacyModal } from "@/components/LegacyModal";

const TEAM = [
  {
    name: "Maaj",
    image: "/rpm/maaj.jpeg",
    major: "CS / Pre-Med",
    role: "Product Design · R&D · Brand Design",
    teams: ["Idea", "Tech", "Content"],
    factLabel: "Favorite candy",
    factValue: "Coffee Crisp",
    factHref: "https://en.wikipedia.org/wiki/Coffee_Crisp",
    link: "https://armaanjhajj.com",
  },
  {
    name: "Sim",
    image: "/rpm/sim.jpeg",
    major: "CS",
    role: "Technical Lead · Moment Maker",
    teams: ["Tech"],
    factLabel: "Favorite playlist",
    factValue: "RapCaviar",
    factHref: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
    link: "https://www.linkedin.com/in/stthomas23/",
  },
  {
    name: "Pop",
    image: "/rpm/pop.jpeg",
    major: "MechE",
    role: "Lead Operations · Management · Logistics",
    teams: ["Growth"],
    factLabel: "Drives",
    factValue: "Nineteen Wheeler",
    factHref: "",
    link: "https://www.arjunpopat1.com/",
  },
  {
    name: "Mir",
    image: "/rpm/mirr.png",
    major: "Finance",
    role: "Lead Logistics · Rick Rubin",
    teams: ["Idea", "Growth", "Content"],
    factLabel: "Most listened to",
    factValue: "2slimey",
    factHref: "https://open.spotify.com/search/2slimey",
    link: "https://www.linkedin.com/in/amir-naidoo/",
  },
];

type Member = (typeof TEAM)[number];

function MemberCard({ member }: { member: Member }) {
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modal = modalOpen && mounted && createPortal(
    <div className="modal-overlay" onClick={() => setModalOpen(false)}>
      <div className="modal team-member-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setModalOpen(false)}>
          &times;
        </button>
        <img src={member.image} alt={member.name} className="team-modal-img" />
        <h2 className="team-modal-name">{member.name}</h2>
        <span className="team-modal-major">{member.major}</span>
        <p className="team-modal-role">{member.role}</p>
        <div className="team-modal-teams">
          {member.teams.map((t) => (
            <span key={t} className="team-modal-team-pill">{t}</span>
          ))}
        </div>
        {member.link && (
          <a
            href={member.link}
            target="_blank"
            rel="noopener noreferrer"
            className="team-modal-link"
          >
            {member.link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
          </a>
        )}
        <div className="team-modal-fact">
          <span className="team-modal-fact-label">{member.factLabel}</span>
          {member.factHref ? (
            <a
              href={member.factHref}
              target="_blank"
              rel="noopener noreferrer"
              className="team-modal-fact-link"
            >
              {member.factValue}
            </a>
          ) : (
            <span className="team-modal-fact-value">{member.factValue}</span>
          )}
        </div>
      </div>
    </div>,
    document.body
  );

  return (
    <>
      <button
        className="team-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setModalOpen(true)}
      >
        <img src={member.image} alt={member.name} className="team-card-img" />
        <div className={`team-card-overlay ${hovered ? "visible" : ""}`}>
          <span className="team-card-name">{member.name}</span>
          <svg className="team-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </div>
      </button>
      {modal}
    </>
  );
}

export function TeamGrid() {
  const [legacyOpen, setLegacyOpen] = useState(false);

  return (
    <div className="team-page">
      <div className="team-grid">
        {TEAM.map((member) => (
          <MemberCard key={member.name} member={member} />
        ))}
      </div>
      <button
        className="team-legacy-btn"
        onClick={() => setLegacyOpen(true)}
      >
        Legacy
      </button>
      <LegacyModal open={legacyOpen} onClose={() => setLegacyOpen(false)} />
    </div>
  );
}
