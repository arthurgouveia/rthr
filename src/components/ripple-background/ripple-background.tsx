'use client';

import { useEffect, useRef } from 'react';
import { useMotionOff } from '@/hooks/use-motion-off';
import { drawRipple } from '@/lib/ripple';
import styles from './ripple-background.module.css';

const FPS = 30;
// Where the wave is frozen when motion is off, so a still frame still has ripples.
const STILL_AT = 8;

const accent = () =>
  getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || 'currentColor';

// A canvas that fills its parent and ripples in the accent colour, dimmed by --ripple-opacity. It
// moves unless motion is off (the customize panel's switch, ?static=1, or a system preference for
// reduced motion), in which case it draws one still frame. Decorative: hidden from assistive tech
// and never clickable.
export function RippleBackground() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const motionOff = useMotionOff();

  useEffect(() => {
    const el = canvas.current;
    const parent = el?.parentElement;
    const ctx = el?.getContext('2d');
    if (!el || !parent || !ctx) return;

    const moving = !motionOff;
    const started = performance.now();
    let w = 0;
    let h = 0;
    let color = accent();
    let frame = 0;
    let drawn = 0;

    const draw = (now: number) => {
      drawRipple(ctx, w, h, moving ? (now - started) / 1000 : STILL_AT, color);
    };

    const resize = () => {
      const box = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = box.width;
      h = box.height;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (now - drawn < 1000 / FPS) return;
      drawn = now;
      draw(now);
    };

    // The accent can change under us (the footer picker, the theme, the customize panel), so look
    // again now and then; a still frame is redrawn when it does.
    const watch = window.setInterval(() => {
      const next = accent();
      if (next === color) return;
      color = next;
      if (!moving) draw(performance.now());
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
