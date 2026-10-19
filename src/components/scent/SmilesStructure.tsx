"use client";

import { useEffect, useRef, useState } from "react";

// smiles-drawer is loaded lazily inside an effect: it is ~100KB, it touches
// document/canvas at import time, and nothing about it can run during SSR.
// One module-level promise so 6 cards on screen share a single download.
let libPromise: Promise<SmilesDrawerModule> | null = null;

type SmilesDrawerModule = {
  Drawer: new (options: Record<string, unknown>) => unknown;
  parse: (
    smiles: string,
    onSuccess: (tree: unknown) => void,
    onError?: (err: unknown) => void
  ) => void;
};

function loadLib(): Promise<SmilesDrawerModule> {
  if (!libPromise) {
    libPromise = import("smiles-drawer").then(
      (mod) => ((mod as { default?: SmilesDrawerModule }).default ??
        mod) as unknown as SmilesDrawerModule
    );
  }
  return libPromise;
}

// Solarized ink and accents on transparent, tuned to sit on the site's beige rather than on the
// library's default white card.
const THEME = {
  C: "#4b5e63",
  O: "#dc322f",
  N: "#268bd2",
  S: "#b58900",
  P: "#cb4b16",
  F: "#2aa198",
  CL: "#2aa198",
  BR: "#cb4b16",
  I: "#6c71c4",
  H: "#4b5e63",
  B: "#4b5e63",
  SI: "#4b5e63",
  BACKGROUND: "#00000000",
};

export function SmilesStructure({
  smiles,
  name,
  size = 260,
}: {
  smiles: string;
  name: string;
  size?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);

    loadLib()
      .then((SmilesDrawer) => {
        if (cancelled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Draw at device resolution, then let CSS scale it back down, or the
        // bond lines go soft on any retina display.
        const dpr = Math.min(window.devicePixelRatio || 1, 3);
        canvas.width = size * dpr;
        canvas.height = size * dpr;

        const drawer = new SmilesDrawer.Drawer({
          width: size * dpr,
          height: size * dpr,
          bondThickness: 1.1 * dpr,
          bondLength: 16 * dpr,
          shortBondLength: 0.85,
          atomVisualization: "default",
          fontSizeLarge: 6.5 * dpr,
          fontSizeSmall: 4.5 * dpr,
          padding: 22 * dpr,
          terminalCarbons: false,
          explicitHydrogens: false,
          compactDrawing: false,
          themes: { scent: THEME },
        }) as { draw: (t: unknown, c: HTMLCanvasElement, theme: string) => void };

        SmilesDrawer.parse(
          smiles,
          (tree) => {
            if (cancelled) return;
            try {
              drawer.draw(tree, canvas, "scent");
            } catch {
              setFailed(true);
            }
          },
          () => {
            if (!cancelled) setFailed(true);
          }
        );
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [smiles, size]);

  if (failed) {
      // Never leave a blank box. Fall back to the SMILES string itself, which
    // is still the real answer, just less pretty.
    return (
      <div className="scent-structure scent-structure-fallback" role="img" aria-label={`Structure of ${name}`}>
        <code>{smiles}</code>
      </div>
    );
  }

  return (
    <div className="scent-structure">
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        role="img"
        aria-label={`Chemical structure of ${name}`}
      />
    </div>
  );
}
