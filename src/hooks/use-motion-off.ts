'use client';

import { useSyncExternalStore } from 'react';
import { isStatic } from '@/lib/motion';

const REDUCED = '(prefers-reduced-motion: reduce)';

// Re-run when html.static is added or removed (the "disable motion" switch, or ?static=1) and,
// for useMotionOff, when the system's reduced-motion setting changes.
const subscribeStatic = (cb: () => void) => {
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
};

const subscribeBoth = (cb: () => void) => {
  const list = window.matchMedia(REDUCED);
  list.addEventListener('change', cb);
  const stopStatic = subscribeStatic(cb);
  return () => {
    list.removeEventListener('change', cb);
    stopStatic();
  };
};

// True when the site's own switch (or ?static=1) has motion off.
export const useStaticMode = () => useSyncExternalStore(subscribeStatic, isStatic, () => false);

// True when motion should not run: the site's switch is on, or the system asks for reduced motion.
export const useMotionOff = () =>
  useSyncExternalStore(
    subscribeBoth,
    () => isStatic() || window.matchMedia(REDUCED).matches,
    () => false,
  );
