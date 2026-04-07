"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";

type Stats = {
  energy: number;
  openness: number;
  discipline: number;
  creativity: number;
  social: number;
  adventure: number;
};

type ImpulseData = {
  mbti_type: string | null;
  synopsis: string | null;
  team_color: string | null;
  stats: Stats | null;
};

const TEAM_LABELS: Record<string, string> = {
  "00F700": "Grinder",
  "1A66FF": "Electric",
  FFD700: "Mellow",
  FF2C77: "All-Rounder",
};

const STAT_LABELS = [
  "Energy",
  "Openness",
  "Discipline",
  "Creativity",
  "Social",
  "Adventure",
] as const;

function RadarChart({ stats, color }: { stats: Stats; color: string }) {
  const values = [
    stats.energy,
    stats.openness,
    stats.discipline,
    stats.creativity,
    stats.social,
    stats.adventure,
  ];
  const size = 240;
  const center = size / 2;
  const radius = size / 2 - 40;
  const sides = 6;

  function point(value: number, index: number) {
    const angle = (Math.PI * 2 * index) / sides - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  }

  function gridPoint(ratio: number, index: number) {
    const angle = (Math.PI * 2 * index) / sides - Math.PI / 2;
    const r = ratio * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  }

  const dataPoints = values.map((v, i) => point(v, i));
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const gridRings = [0.25, 0.5, 0.75, 1].map((ratio) =>
    Array.from({ length: sides }, (_, i) => gridPoint(ratio, i))
      .map((p) => `${p.x},${p.y}`)
      .join(" ")
  );

  const labelPoints = STAT_LABELS.map((_, i) => {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
    const r = radius + 18;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="radar-chart">
      {gridRings.map((path, i) => (
        <polygon
          key={i}
          points={path}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: sides }, (_, i) => {
        const p = gridPoint(1, i);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={dataPath}
        fill={`#${color}`}
        fillOpacity="0.3"
        stroke={`#${color}`}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={`#${color}`} />
      ))}
      {labelPoints.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={p.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255, 255, 255, 0.5)"
          fontSize="10"
          fontWeight="600"
          letterSpacing="0.1em"
        >
          {STAT_LABELS[i].toUpperCase()}
        </text>
      ))}
    </svg>
  );
}

function ModalContent({
  userId,
  userName,
  onClose,
}: {
  userId: string;
  userName: string;
  onClose: () => void;
}) {
  const [data, setData] = useState<ImpulseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("impulse")
        .select("mbti_type, synopsis, team_color, stats")
        .eq("user_id", userId)
        .maybeSingle();
      setData(data);
      setLoading(false);
    }
    load();
  }, [userId]);

  const color = data?.team_color || "FF2C77";
  const teamLabel = TEAM_LABELS[color] || "All-Rounder";

  return (
    <div className="impulse-modal-overlay" onClick={onClose}>
      <div className="impulse-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <img
          src="/impulse.png"
          alt="Impulse"
          className="impulse-modal-logo"
        />

        {loading ? (
          <div className="impulse-modal-loading">
            <div className="photo-spinner-logo">
              <img
                src="/impulse.png"
                alt=""
                style={{ width: 36, height: 36, filter: "brightness(0) invert(1)" }}
              />
            </div>
            <p>Reading their signal...</p>
          </div>
        ) : !data || !data.stats ? (
          <div className="impulse-modal-empty">
            <p>No Impulse signal yet</p>
            <p className="impulse-modal-empty-sub">
              {userName} hasn&apos;t set up Impulse.
            </p>
          </div>
        ) : (
          <>
            <div className="impulse-modal-header">
              <span
                className="impulse-team-badge"
                style={{
                  background: `#${color}22`,
                  color: `#${color}`,
                  borderColor: `#${color}44`,
                }}
              >
                {teamLabel.toUpperCase()}
              </span>
              <h2 className="impulse-modal-name">{userName}</h2>
              {data.mbti_type && (
                <span className="impulse-mbti">{data.mbti_type}</span>
              )}
            </div>

            {data.synopsis && (
              <p className="impulse-synopsis">{data.synopsis}</p>
            )}

            <RadarChart stats={data.stats} color={color} />
          </>
        )}
      </div>
    </div>
  );
}

export function ImpulseModal({
  open,
  onClose,
  userId,
  userName,
}: {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  return createPortal(
    <ModalContent userId={userId} userName={userName} onClose={onClose} />,
    document.body
  );
}
