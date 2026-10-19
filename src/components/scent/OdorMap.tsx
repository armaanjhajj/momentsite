"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MOLECULES, MOLECULE_XY, moleculeVector } from "@/lib/scent/project";
import { MACRO_NAMES, macroZone, msiFor } from "@/lib/scent/msi";
import type { Molecule } from "@/lib/scent/types";

// The scatter used to be a cloud because nothing structured it. Now every
// molecule carries a zone, so the map can draw regions, name them, and let you
// zoom from ten labelled areas down to individual molecules. Same data, but
// legible, and the zoom is the interaction.

type Point = {
  molecule: Molecule;
  xy: [number, number];
  zone: number;
  msi: string;
};

/**
 * The background layer: every GS-LF molecule the embedding was fitted over.
 *
 * The map drew 156 points while placement used 5,548, so it showed the
 * annotated fraction of the space and implied that was the space. These are
 * drawn as small dim dots and are not interactive: they carry no card, so
 * there is nothing for a hover to open.
 *
 * Fetched after first paint rather than bundled. Inlined it would add roughly
 * 156 KB to /scent for points nobody can click.
 */
type Backdrop = { xy: Array<[number, number]> } | null;

const POINTS: Point[] = MOLECULES.map((m) => {
  const v = moleculeVector(m.id);
  return {
    molecule: m,
    xy: MOLECULE_XY[m.id] ?? [0, 0],
    zone: macroZone(v),
    msi: msiFor(v).label,
  };
});

// Ten hues spaced around the wheel, in MSI order, so the legend reads as a
// sequence rather than a set of unrelated colours.
const zoneHue = (z: number) => (z * 36 + 12) % 360;

/** Convex hull, monotone chain. Used to outline a region's territory. */
function hull(pts: Array<[number, number]>): Array<[number, number]> {
  if (pts.length < 3) return pts;
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: number[], a: number[], b: number[]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

  const lower: Array<[number, number]> = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0)
      lower.pop();
    lower.push(q);
  }
  const upper: Array<[number, number]> = [];
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0)
      upper.pop();
    upper.push(q);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

const ZONE_SHAPES = Array.from({ length: 10 }, (_, z) => {
  const members = POINTS.filter((p) => p.zone === z);
  const centre: [number, number] = members.length
    ? [
        members.reduce((s, m) => s + m.xy[0], 0) / members.length,
        members.reduce((s, m) => s + m.xy[1], 0) / members.length,
      ]
    : [0, 0];
  return { zone: z, hull: hull(members.map((m) => m.xy)), centre, count: members.length };
});

const PAD = 30;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 14;

// Detail thresholds. Region labels fade out as molecules earn their own names,
// so the map never shows both kinds of label competing.
const SHOW_MOLECULE_NAMES = 3.2;
const HIDE_REGION_LABELS = 4.5;

// Named jumps. The wheel and drag give free movement, but three labelled stops
// say what there is to look at, which bare plus and minus buttons do not.
const PRESETS = [
  { id: 1, label: "Regions", zoom: 1 },
  { id: 2, label: "Zones", zoom: 2.4 },
  { id: 3, label: "Molecules", zoom: 5 },
];

type Props = {
  highlight: string[];
  query: [number, number] | null;
  /** the memory's MSI, so the pin can be labelled */
  queryMsi?: string;
};

export function OdorMap({ highlight, query, queryMsi }: Props) {
  const [backdrop, setBackdrop] = useState<Backdrop>(null);

  useEffect(() => {
    let live = true;
    fetch("/scent/atlas-xy.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { xy: Array<[number, number]> } | null) => {
        if (live && d?.xy) setBackdrop({ xy: d.xy });
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, []);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState<{ p: Point; x: number; y: number } | null>(null);

  // view = zoom plus a pan offset in pixels
  const [view, setView] = useState({ zoom: 1, x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      setSize({ w: Math.round(e.contentRect.width), h: Math.round(e.contentRect.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Zooming keeps the query centred, so the thing you asked about stays put
  // while the detail around it resolves.
  const toPixel = useCallback(
    (xy: [number, number]): [number, number] => {
      const { w, h } = size;
      const span = (Math.min(w, h) / 2 - PAD) * view.zoom;
      return [w / 2 + xy[0] * span + view.x, h / 2 - xy[1] * span + view.y];
    },
    [size, view]
  );

  const litSet = useMemo(() => new Set(highlight), [highlight]);

  // A new memory resets the view, otherwise you stay parked wherever the last
  // one left you and the new pin can be off screen entirely.
  const lastQuery = useRef<string>("");
  useEffect(() => {
    const key = query ? query.join(",") : "";
    if (key === lastQuery.current) return;
    lastQuery.current = key;
    setView({ zoom: 1, x: 0, y: 0 });
  }, [query]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !size.w || !size.h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size.w, size.h);

    // 1. region territories
    for (const s of ZONE_SHAPES) {
      if (s.hull.length < 3) continue;
      const hue = zoneHue(s.zone);
      ctx.beginPath();
      s.hull.forEach((pt, i) => {
        const [x, y] = toPixel(pt);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = `hsla(${hue}, 60%, 55%, ${view.zoom < 2 ? 0.1 : 0.045})`;
      ctx.fill();
      ctx.strokeStyle = `hsla(${hue}, 65%, 62%, ${view.zoom < 2 ? 0.5 : 0.2})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 1b. the wider corpus, behind everything interactive
    if (backdrop) {
      ctx.fillStyle = "rgba(255,255,255,0.16)";
      const r = view.zoom >= SHOW_MOLECULE_NAMES ? 1.1 : 0.8;
      for (const xy of backdrop.xy) {
        const [x, y] = toPixel(xy);
        if (x < -4 || x > size.w + 4 || y < -4 || y > size.h + 4) continue;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. connective lines from the memory to its neighbours
    const qp = query ? toPixel(query) : null;
    if (qp) {
      ctx.lineWidth = 1;
      for (const id of highlight) {
        const p = POINTS.find((x) => x.molecule.id === id);
        if (!p) continue;
        const [x, y] = toPixel(p.xy);
        const g = ctx.createLinearGradient(qp[0], qp[1], x, y);
        g.addColorStop(0, "rgba(255,255,255,0.4)");
        g.addColorStop(1, "rgba(255,255,255,0.04)");
        ctx.strokeStyle = g;
        ctx.beginPath();
        ctx.moveTo(qp[0], qp[1]);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }

    // 3. molecules
    for (const p of POINTS) {
      const [x, y] = toPixel(p.xy);
      if (x < -20 || x > size.w + 20 || y < -20 || y > size.h + 20) continue;
      const lit = litSet.has(p.molecule.id);
      const hue = zoneHue(p.zone);
      const isHover = hovered?.p.molecule.id === p.molecule.id;

      if (lit) {
        const halo = ctx.createRadialGradient(x, y, 0, x, y, 15);
        halo.addColorStop(0, `hsla(${hue}, 85%, 68%, 0.5)`);
        halo.addColorStop(1, `hsla(${hue}, 85%, 68%, 0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(x, y, lit ? 4.4 : isHover ? 4 : view.zoom >= SHOW_MOLECULE_NAMES ? 3.2 : 2.3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, ${lit ? 90 : 62}%, ${lit ? 72 : 60}%, ${
        lit || isHover ? 1 : query ? 0.42 : 0.7
      })`;
      ctx.fill();
      if (lit) {
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = "rgba(0,0,0,0.55)";
        ctx.stroke();
      }

      // At the deepest zoom the molecules name themselves.
      if (view.zoom >= SHOW_MOLECULE_NAMES) {
        ctx.font = "9px Inter, sans-serif";
        ctx.fillStyle = lit ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)";
        ctx.fillText(p.molecule.name, x + 7, y + 3);
      }
    }

    // 4. region labels, on top of everything
    if (view.zoom < HIDE_REGION_LABELS) {
      for (const s of ZONE_SHAPES) {
        if (!s.count) continue;
        const [x, y] = toPixel(s.centre);
        if (x < 0 || x > size.w || y < 0 || y > size.h) continue;
        const hue = zoneHue(s.zone);

        ctx.font = "700 10px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = `hsla(${hue}, 70%, 72%, 0.95)`;
        ctx.fillText(`${s.zone}xx`, x, y - 6);

        ctx.font = "500 9.5px Inter, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fillText(MACRO_NAMES[s.zone], x, y + 7);
        ctx.textAlign = "left";
      }
    }

    // 5. the memory, as a pin rather than a dot: it is not a molecule
    if (qp) {
      ctx.beginPath();
      ctx.arc(qp[0], qp[1], 10, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.95)";
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(qp[0], qp[1], 2.4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      if (queryMsi) {
        ctx.font = "700 11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(queryMsi, qp[0], qp[1] - 16);
        ctx.textAlign = "left";
      }
    }
  }, [size, highlight, query, hovered, view, toPixel, litSet, queryMsi, backdrop]);

  // Wheel handling is attached natively because React's onWheel is passive
  // and cannot preventDefault, which would let the page scroll while zooming.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;

      setView((v) => {
        const factor = Math.exp(-e.deltaY * 0.0016);
        const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.zoom * factor));
        const k = zoom / v.zoom;
        // Keep the point under the cursor fixed while the scale changes.
        return {
          zoom,
          x: mx - (mx - v.x) * k,
          y: my - (my - v.y) * k,
        };
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  /**
   * Jump to a preset, framing the memory rather than the origin. Without the
   * offset, zooming to Molecules lands on whatever happens to sit at the
   * centre of the corpus instead of the thing you searched for.
   */
  const jumpTo = (zoom: number) => {
    const span = (Math.min(size.w, size.h) / 2 - PAD) * zoom;
    if (!query || zoom <= 1) {
      setView({ zoom, x: 0, y: 0 });
      return;
    }
    setView({ zoom, x: -query[0] * span, y: query[1] * span });
  };

  // Which preset the current zoom is sitting in, so the row reflects wheel
  // movement rather than only responding to its own clicks.
  const activePreset =
    [...PRESETS].reverse().find((p) => view.zoom >= p.zoom * 0.9)?.id ?? null;

  const onDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
    setDragging(true);
  };

  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drag.current) {
      const d = drag.current;
      setView((v) => ({
        ...v,
        x: d.vx + (e.clientX - d.x),
        y: d.vy + (e.clientY - d.y),
      }));
      setHovered(null);
      return;
    }

    const r = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    let best: { p: Point; x: number; y: number } | null = null;
    let bd = 14 * 14;
    for (const p of POINTS) {
      const [x, y] = toPixel(p.xy);
      const d = (x - mx) ** 2 + (y - my) ** 2;
      if (d < bd) {
        bd = d;
        best = { p, x, y };
      }
    }
    setHovered(best);
  };

  return (
    <div className="scent-map-wrap">
      <div className="scent-map-controls">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`scent-map-level${
              activePreset === p.id ? " scent-map-level-on" : ""
            }`}
            onClick={() => jumpTo(p.zoom)}
          >
            {p.label}
          </button>
        ))}
        <span className="scent-map-zoom">{view.zoom.toFixed(1)}x</span>
        <span className="scent-map-hint">scroll to zoom, drag to pan</span>
      </div>

      <div className="scent-map" ref={wrapRef}>
        <canvas
          ref={canvasRef}
          style={{
            width: size.w,
            height: size.h,
            cursor: dragging ? "grabbing" : "grab",
          }}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={endDrag}
          onMouseLeave={() => {
            endDrag();
            setHovered(null);
          }}
        />
        {hovered && (
          <div
            className="scent-map-tip"
            style={{
              left: hovered.x,
              top: hovered.y,
              transform: `translate(${hovered.x > size.w * 0.7 ? "-100%" : "-50%"}, -170%)`,
            }}
          >
            <strong>{hovered.p.molecule.name}</strong>
            <span>
              MSI {hovered.p.msi}, {MACRO_NAMES[hovered.p.zone]}
            </span>
          </div>
        )}
      </div>

      <ul className="scent-map-legend">
        {MACRO_NAMES.map((name, z) => (
          <li key={z}>
            <span
              className="scent-map-swatch"
              style={{ background: `hsl(${zoneHue(z)}, 65%, 60%)` }}
            />
            <span className="scent-map-legend-num">{z}xx</span>
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
