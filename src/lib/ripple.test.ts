import { describe, expect, it, vi } from 'vitest';
import { CELL, drawRipple, rippleBrightness } from './ripple';

describe('ripple', () => {
  it('keeps every square between dark and fully lit', () => {
    const centres: [number, number][] = [
      [100, 100],
      [300, 200],
    ];
    for (let x = 0; x < 600; x += 37) {
      for (let t = 0; t < 20; t += 3) {
        const b = rippleBrightness(x, x / 2, t, centres);
        expect(b).toBeGreaterThanOrEqual(0);
        expect(b).toBeLessThanOrEqual(1);
      }
    }
  });

  it('moves with time', () => {
    const centres: [number, number][] = [[50, 50]];
    expect(rippleBrightness(120, 50, 0, centres)).not.toBe(rippleBrightness(120, 50, 2, centres));
  });

  it('clears the canvas, draws squares in the given colour, and restores the alpha', () => {
    const ctx = {
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      fillStyle: '',
      globalAlpha: 1,
    };
    // biome-ignore lint/suspicious/noExplicitAny: a stand-in for CanvasRenderingContext2D
    drawRipple(ctx as any, 80 * CELL, 40 * CELL, 5, '#f0b429');
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 80 * CELL, 40 * CELL);
    expect(ctx.fillStyle).toBe('#f0b429');
    expect(ctx.fillRect).toHaveBeenCalled();
    expect(ctx.globalAlpha).toBe(1);
  });
});
