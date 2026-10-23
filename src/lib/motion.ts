// Client-only helpers: read at event time or in effects, never during render.

import { KEYS, store } from '@/lib/store';

export const cssMs = (name: string) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = parseFloat(v);
  return Number.isNaN(n) ? 0 : v.endsWith('ms') ? n : n * 1000;
};

// html.static turns every animation off. ?static=1 sets it for screenshots and previews, and the
// "disable motion" switch in the customize panel sets it for good (see setMotionOff).
export const isStatic = () => document.documentElement.classList.contains('static');

// Turn the site's motion off or on, and remember the choice for next time (the boot script reads it).
export function setMotionOff(off: boolean) {
  document.documentElement.classList.toggle('static', off);
  if (off) store.set(KEYS.motion, 'off');
  else store.remove(KEYS.motion);
}
