'use client';

import { useEffect, useRef } from 'react';
import { useMotionOff } from '@/hooks/use-motion-off';
import { CELL, drawRipple } from '@/lib/ripple';
import styles from './ripple-background.module.css';

const FPS = 30;
// Where the wave is frozen when motion is off, so a still frame still has ripples.
const STILL_AT = 8;

// What the canvas looks like, read from the design tokens (so the customize panel edits it live).
type Look = { color: string; cell: number; speed: number };

const number = (value: string, fallback: number) => {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
};

function readLook(): Look {
  const style = getComputedStyle(document.documentElement);
  const token = (name: string) => style.getPropertyValue(name).trim();
  return {
    color: token('--accent') || 'currentColor',
    // never so small that it costs too much to draw, or so big that it is just a few blocks
    cell: Math.min(Math.max(number(token('--ripple-size'), CELL), 3), 32),
    speed: Math.max(number(token('--ripple-speed'), 1), 0),
  };
}

const sameLook = (a: Look, b: Look) =>
  a.color === b.color && a.cell === b.cell && a.speed === b.speed;

// A canvas that fills its parent and ripples in the accent colour, dimmed by --ripple-opacity, with
// its square size and speed set by --ripple-size and --ripple-speed. It moves unless motion is off
// (the customize panel's switch, ?static=1, or a system preference for reduced motion), in which
// case it draws one still frame. Decorative: hidden from assistive tech and never clickable.
export function RippleBackground() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const motionOff = useMotionOff();

  useEffect(() => {
    const el = canvas.current;
    const parent = el?.parentElement;
    const ctx = el?.getContext('2d');
    if (!el || !parent || !ctx) return;

    const moving = !motionOff;
    let look = readLook();
    let w = 0;
    let h = 0;
    let frame = 0;
    let clock = STILL_AT; // seconds of wave time; speed scales how fast it runs
    let last = performance.now();
    let drawn = 0;

    const draw = () => drawRipple(ctx, w, h, clock, look.color, look.cell);

    const resize = () => {
      const box = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = box.width;
      h = box.height;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      clock += ((now - last) / 1000) * look.speed;
      last = now;
      if (now - drawn < 1000 / FPS || look.speed === 0) return;
      drawn = now;
      draw();
    };

    // The look can change under us (the footer picker, the theme, the customize panel), so look
    // again now and then; a still frame is redrawn when it does.
    const watch = window.setInterval(() => {
      const next = readLook();
      if (sameLook(look, next)) return;
      look = next;
      if (!moving || look.speed === 0) draw();
    }, 250);

    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    resize();
    if (moving) frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(watch);
      observer.disconnect();
    };
  }, [motionOff]);

  // biome-ignore lint/a11y/noAriaHiddenOnFocusable: a canvas with no fallback content and no tabindex is not focusable
  return <canvas aria-hidden='true' className={styles.canvas} ref={canvas} />;
}
