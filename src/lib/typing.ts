import { content } from '@/lib/content';

// Timing for the CSS typing effect, in ticks (1 tick = --duration-type, 55ms by default).
// The first status key starts 10 ticks after the command; each next key 7 ticks after the last began.
export function statusTimeline(cmdLen: number) {
  let at = cmdLen + 10;
  const lines = content.index.status.map((s) => {
    const start = at;
    at += s.key.length + 7;
    return { ...s, at: start };
  });
  return { lines, end: at };
}
