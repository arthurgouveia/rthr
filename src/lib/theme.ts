'use client';

import { useSyncExternalStore } from 'react';
import { KEYS, store } from '@/lib/store';
import {
  ACCENTS,
  type Accent,
  DEFAULT_ACCENT,
  DEFAULT_THEME,
  THEMES,
  type Theme,
} from '@/lib/theme-config';

export { ACCENTS, type Accent, type Theme };

const asAccent = (v?: string): Accent => ACCENTS.find((r) => r === v) ?? DEFAULT_ACCENT;

const listeners = new Set<() => void>();
const emit = () => {
  for (const l of listeners) l();
};
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const root = () => document.documentElement;

// Keep <meta name="theme-color"> in sync with the current --bg.
export function syncThemeColor() {
  const bg = getComputedStyle(root()).getPropertyValue('--bg').trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg);
}

export function setTheme(t: Theme) {
  root().dataset.theme = t;
  store.set(KEYS.theme, t);
  syncThemeColor();
  emit();
}

export function setAccent(r: Accent) {
  root().dataset.accent = r;
  store.set(KEYS.accent, r);
  emit();
}

export function useTheme(): Theme {
  return useSyncExternalStore(
    subscribe,
    () => THEMES.find((t) => t === root().dataset.theme) ?? DEFAULT_THEME,
    () => DEFAULT_THEME,
  );
}

export function useAccent(): Accent {
  return useSyncExternalStore(
    subscribe,
    () => asAccent(root().dataset.accent),
    () => DEFAULT_ACCENT,
  );
}
