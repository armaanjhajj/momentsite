import React, { useRef, useState, useCallback } from 'react';
import './Logo.scss';

/**
 * Logo
 * - Inline SVG split into separate <path> elements so each part is targetable
 * - On mouse move, finds the closest path and applies a glow style
 * - On leave, resets all paths
 * - Responsive: SVG scales with font-size / container; accepts `className` prop
 */
export default function Logo({ className = '' }) {
  const svgRef = useRef(null);
  const [activeId, setActiveId] = useState(null);

  // Cache path centers for faster calculation
  const getPathCenters = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return [];
    const paths = Array.from(svg.querySelectorAll('[data-part]'));
    return paths.map((p) => {
      const bbox = p.getBBox();
      // center in SVG user space and include bbox size for thresholding
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;
      const w = bbox.width;
      const h = bbox.height;
      // radius for approximate hit detection (half the larger dimension)
      const radius = Math.max(w, h) / 2;
      return { id: p.getAttribute('data-part'), x: cx, y: cy, w, h, r: radius };
    });
  }, []);

  // Convert mouse event to SVG point
  const getSvgPoint = (evt) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    return pt.matrixTransform(ctm.inverse());
  };

  const handleMove = (evt) => {
    const pt = getSvgPoint(evt);
    if (!pt) return;
    const centers = getPathCenters();
    if (!centers.length) return;
    // find closest center
    let min = Infinity;
    let closest = null;
    for (const c of centers) {
      const dx = pt.x - c.x;
      const dy = pt.y - c.y;
      const d = dx * dx + dy * dy;
      if (d < min) {
        min = d;
        closest = c.id;
      }
    }
    // only activate if pointer is reasonably close to the letter's bbox center
    const closestObj = centers.find((c) => c.id === closest);
    if (closestObj) {
      // use a threshold proportional to the letter size; slightly generous to account for kerning
      const threshold = Math.max(closestObj.r * 1.2, 18); // minimum of 18 units
      if (min <= threshold * threshold) setActiveId(closest);
      else setActiveId(null);
    } else {
      setActiveId(null);
    }
  };

  const handleLeave = () => setActiveId(null);

  // Render the word 'moments' as a single <text> with per-letter <tspan> so font kerning is preserved
  const letters = ['m', 'o', 'm', 'e', 'n', 't', 's'];
  // base sizes for the viewBox and letter spacing (wider/taller to match the sample)
  const viewW = 1600;
  const viewH = 260;

  return (
    <div className={`logo-wrapper flex items-center justify-center ${className}`}>
      <svg
        ref={svgRef}
        className="logo-svg"
        viewBox={`0 0 ${viewW} ${viewH}`}
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onTouchStart={(e) => handleMove(e.touches[0])}
        onTouchMove={(e) => handleMove(e.touches[0])}
        onTouchEnd={handleLeave}
        role="img"
        aria-label="moments logo"
      >
        <defs>
          <linearGradient id="gradA" x1="0" x2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>

        <g className="logo-group" fill="currentColor" stroke="none">
          {/* Single text node with tspans so font kerning/optical spacing is preserved. */}
          <text
            x="50%"
            y={viewH / 2}
            className={`logo-path logo-word`}
            textAnchor="middle"
            dominantBaseline="middle"
            aria-hidden="true"
          >
            {letters.map((ch, i) => {
              const id = `part-${i + 1}`;
              return (
                <tspan
                  key={id}
                  data-part={id}
                  className={`logo-letter ${activeId === id ? 'active' : ''}`}
                >
                  {ch}
                </tspan>
              );
            })}
          </text>
        </g>
      </svg>
    </div>
  );
}
