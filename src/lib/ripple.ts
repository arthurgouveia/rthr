// The ripple grid: a field of small squares whose brightness is the sum of waves spreading from
// three slowly drifting centres. Pure drawing code, so the component only has to run it.

export const CELL = 8; // px per square, gap included
const SPREAD = 180; // how far the centres wander, in px

type Centre = [x: number, y: number];

const centres = (w: number, h: number, t: number): Centre[] => [
  [w * 0.28 + Math.sin(t * 0.16) * SPREAD, h * 0.38 + Math.cos(t * 0.11) * SPREAD * 0.6],
  [w * 0.72 + Math.cos(t * 0.13) * SPREAD * 0.8, h * 0.62 + Math.sin(t * 0.15) * SPREAD * 0.7],
  [w * 0.5 + Math.sin(t * 0.1 + 2) * SPREAD * 0.4, h * 0.18 + Math.cos(t * 0.12) * SPREAD * 0.4],
];

// Brightness (0 to 1) of the square centred at (x, y), at time t seconds.
export function rippleBrightness(x: number, y: number, t: number, from: Centre[]) {
  let b = 0;
  for (const [ox, oy] of from) {
    const d = Math.hypot(x - ox, y - oy);
    b += Math.sin(d / 40 - t * 1.05) * Math.exp(-d / 520);
  }
  return Math.min(Math.max(b * 0.44 + 0.055, 0), 1);
}

// Draws one frame onto a transparent canvas of w by h CSS pixels, in a single colour.
export function drawRipple(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  color: string,
) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = color;
  const from = centres(w, h, t);
  for (let y = 0; y < h; y += CELL) {
    for (let x = 0; x < w; x += CELL) {
      const b = rippleBrightness(x + CELL / 2, y + CELL / 2, t, from);
      if (b < 0.028) continue;
      ctx.globalAlpha = b;
      ctx.fillRect(x, y, CELL - 1, CELL - 1);
    }
  }
  ctx.globalAlpha = 1;
}
