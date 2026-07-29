"use client";

import { useEffect, useRef, useState } from "react";
import { FAMILIES, FAMILY_COUNT } from "@/data/scent/families";

export type PolygonSeries = {
  values: number[]; // length FAMILY_COUNT, each 0..1
  color: string;
  label?: string;
  dashed?: boolean;
};

// SVG rather than canvas: the shape needs crisp thin strokes at any size, the
// axis labels need to be selectable text, and morphing between two shapes is a
// numeric interpolation the browser does not need to help with.

const RINGS = 4;

function polar(i: number, radius: number, cx: number, cy: number) {
  // Start at 12 o'clock and go clockwise, so the shape reads like a dial.
  const angle = (i / FAMILY_COUNT) * Math.PI * 2 - Math.PI / 2;
  return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius] as const;
}

function pointsFor(values: number[], cx: number, cy: number, r: number) {
  return values
    .map((v, i) => {
      const [x, y] = polar(i, Math.max(0.02, Math.min(1, v)) * r, cx, cy);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

/**
 * Smoothly interpolate towards a target vector.
 *
 * Used by the walk, where the point is watching the shape deform continuously
 * rather than snapping between frames, a snap reads as five unrelated
 * pictures, a morph reads as one journey.
 */
function useMorph(target: number[], enabled: boolean, duration = 420): number[] {
  const [current, setCurrent] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Six molecule cards on screen each render a static polygon; running a
    // tween for them would burn a requestAnimationFrame loop apiece to
    // animate nothing.
    if (!enabled) return;

    fromRef.current = current.length === target.length ? current : target;
    startRef.current = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - startRef.current) / duration);
      // ease-out cubic
      const e = 1 - Math.pow(1 - t, 3);
      setCurrent(fromRef.current.map((v, i) => v + (target[i] - v) * e));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // `current` deliberately excluded: including it would restart the tween on
    // every frame it sets, which never terminates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, enabled]);

  return current;
}

export function ScentPolygon({
  series,
  size = 320,
  morph = false,
  showLabels = true,
}: {
  series: PolygonSeries[];
  size?: number;
  morph?: boolean;
  showLabels?: boolean;
}) {
  const pad = showLabels ? 46 : 12;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - pad;

  // Only the first series animates; a blend overlay is static by nature.
  const morphed = useMorph(series[0].values, morph);
  const primary = morph ? morphed : series[0].values;

  return (
    <svg
      className="scent-polygon"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={
        "Odor profile across " +
        FAMILIES.map((f) => f.label).join(", ")
      }
    >
      {/* grid rings */}
      {Array.from({ length: RINGS }, (_, k) => {
        const rr = (r * (k + 1)) / RINGS;
        return (
          <polygon
            key={k}
            points={pointsFor(new Array(FAMILY_COUNT).fill(rr / r), cx, cy, r)}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={1}
          />
        );
      })}

      {/* spokes */}
      {FAMILIES.map((f, i) => {
        const [x, y] = polar(i, r, cx, cy);
        return (
          <line
            key={f.id}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={1}
          />
        );
      })}

      {/* series */}
      {series.map((s, si) => {
        const values = si === 0 ? primary : s.values;
        return (
          <g key={si}>
            <polygon
              points={pointsFor(values, cx, cy, r)}
              fill={s.color}
              fillOpacity={series.length > 1 ? 0.16 : 0.22}
              stroke={s.color}
              strokeWidth={1.6}
              strokeDasharray={s.dashed ? "4 3" : undefined}
              strokeLinejoin="round"
            />
            {/* vertex dots only on the primary, or the chart gets noisy */}
            {si === 0 &&
              values.map((v, i) => {
                if (v < 0.06) return null;
                const [x, y] = polar(i, Math.min(1, v) * r, cx, cy);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={2.4}
                    fill={`hsl(${FAMILIES[i].hue}, 75%, 66%)`}
                  />
                );
              })}
          </g>
        );
      })}

      {/* axis labels */}
      {showLabels &&
        FAMILIES.map((f, i) => {
          const [x, y] = polar(i, r + 17, cx, cy);
          const anchor =
            Math.abs(x - cx) < 6 ? "middle" : x > cx ? "start" : "end";
          const active = primary[i] > 0.12;
          return (
            <text
              key={f.id}
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize={9.5}
              letterSpacing="0.04em"
              fill={
                active
                  ? `hsl(${f.hue}, 70%, 70%)`
                  : "rgba(255,255,255,0.28)"
              }
            >
              {f.label}
            </text>
          );
        })}
    </svg>
  );
}
