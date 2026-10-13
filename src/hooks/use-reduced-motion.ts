'use client';

import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';

const subscribe = (cb: () => void) => {
  const list = window.matchMedia(query);
  list.addEventListener('change', cb);
  return () => list.removeEventListener('change', cb);
};

export const useReducedMotion = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
