// Utility functions for formatting and animations

export function formatNumber(num: number, suffix?: string): string {
  if (suffix) return `${num.toLocaleString()}${suffix}`;
  return num.toLocaleString();
}

export function easeOutQuad(t: number): number {
  return t * (2 - t);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
}

