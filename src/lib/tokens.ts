'use client';

import { KEYS, store } from '@/lib/store';
import { syncThemeColor, type Theme } from '@/lib/theme';

export const TOKEN_TABS = ['colors', 'spacing', 'type', 'motion', 'canvas'] as const;
export type TokenTab = (typeof TOKEN_TABS)[number];

type ColorToken = { kind: 'color'; name: string; label: string };
// A slider. `unit` is added to the stored value ('' for a plain number); `step` is the slider's grain.
type RangeToken = {
  kind: 'range';
  name: string;
  min: number;
  max: number;
  unit: 'px' | 'ms' | '';
  step: number;
};
export type TokenDef = ColorToken | RangeToken;

const color = (name: string, label: string): ColorToken => ({ kind: 'color', name, label });
const px = (name: string, min: number, max: number): RangeToken => ({
  kind: 'range',
  name,
  min,
  max,
  unit: 'px',
  step: 1,
});
const ms = (name: string, max: number): RangeToken => ({
  kind: 'range',
  name,
  min: 0,
  max,
  unit: 'ms',
  step: 1,
});
const scale = (name: string, min: number, max: number, step: number): RangeToken => ({
  kind: 'range',
  name,
  min,
  max,
  unit: '',
  step,
});

// "accent" is not a real variable: it stands for whichever --accent-* is selected (see realName).
export const TOKENS: Record<TokenTab, TokenDef[]> = {
  colors: [
    color('--bg', 'background'),
    color('--fg', 'text'),
    color('--strong', 'strong'),
    color('--soft', 'soft'),
    color('--muted', 'muted'),
    color('--line', 'lines'),
    color('--active', 'active row'),
    color('accent', 'accent'),
  ],
  spacing: [
    px('--space-xs', 0, 16),
    px('--space-sm', 0, 24),
    px('--space-md', 0, 40),
    px('--space-lg', 0, 64),
    px('--space-xl', 0, 96),
    px('--space-2xl', 0, 160),
    px('--sidebar-w', 160, 480),
    px('--content-w', 640, 1600),
    px('--detail-w', 280, 640),
  ],
  type: [
    px('--text-display-lg', 32, 240),
    px('--text-display-sm', 24, 120),
    px('--text-lg', 12, 40),
    px('--text-md', 11, 28),
    px('--text-base', 11, 20),
    px('--text-sm', 10, 18),
    px('--text-xs', 9, 16),
  ],
  motion: [
    ms('--duration-type', 300),
    ms('--duration-fast', 1000),
    ms('--duration-base', 2000),
    ms('--duration-slow', 2000),
  ],
  canvas: [
    scale('--ripple-opacity', 0, 1, 0.05),
    px('--ripple-size', 4, 24),
    scale('--ripple-speed', 0, 3, 0.1),
  ],
};

export const tokenLabel = (def: TokenDef) =>
  def.kind === 'color' ? def.label : def.name.replace('--', '');

export const SCOPE: Record<TokenTab, string> = {
  colors: 'colours apply to the current theme only. switch theme to edit the other.',
  spacing: 'six steps drive every gap and padding on the site.',
  type: 'seven sizes. display = Pirata One. phone has its own defaults.',
  motion: 'durations in ms. 0 turns an animation off.',
  canvas: 'the ripple behind the page. opacity 0 hides it; speed 0 freezes it.',
};

export type Overrides = {
  shared: Record<string, string>;
  dark: Record<string, string>;
  lame: Record<string, string>;
};

export const emptyOverrides = (): Overrides => ({ shared: {}, dark: {}, lame: {} });

export function loadOverrides(): Overrides {
  try {
    const o = JSON.parse(store.get(KEYS.tokens) || 'null');
    const bucket = (v: unknown): Record<string, string> =>
      v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, string>) : {};
    if (o && typeof o === 'object')
      return { shared: bucket(o.shared), dark: bucket(o.dark), lame: bucket(o.lame) };
  } catch {}
  return emptyOverrides();
}

const css = (o: Overrides) => {
  const block = (sel: string, vars: Record<string, string>) => {
    const keys = Object.keys(vars);
    return keys.length ? `${sel} {\n${keys.map((k) => `  ${k}: ${vars[k]};`).join('\n')}\n}\n` : '';
  };
  return (
    block(':root', o.shared) +
    block(':root[data-theme="dark"]', o.dark) +
    block(':root[data-theme="lame"]', o.lame)
  );
};

// Write overrides into <style id="token-overrides"> (after tokens.css) and persist them.
export function applyOverrides(o: Overrides) {
  let el = document.getElementById('token-overrides');
  if (!el) {
    el = document.createElement('style');
    el.id = 'token-overrides';
    document.head.appendChild(el);
  }
  el.textContent = css(o);
  store.set(KEYS.tokens, JSON.stringify(o));
  syncThemeColor();
}

// CSS variable name for a token, resolving "accent" to the accent currently selected.
export const realName = (name: string, accent: string) =>
  name === 'accent' ? `--accent-${accent}` : name;

// Colours (accent included, since each theme defines its own accents) are saved per theme; the rest are shared.
export const bucketFor = (o: Overrides, t: TokenDef, theme: Theme) =>
  t.kind === 'color' ? o[theme] : o.shared;

export const currentValue = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// The number in a CSS value, in the unit the token is edited in. The build minifies CSS, so a
// duration written as 200ms can come back as .2s: seconds are turned back into milliseconds.
export function numericValue(value: string) {
  const n = parseFloat(value) || 0;
  return /\d\s*s$/.test(value.trim()) && !/ms$/.test(value.trim()) ? Math.round(n * 1000) : n;
}

export const isHex = (v: string) => /^#[0-9a-f]{6}$/i.test(v);

// What to store for a value typed into an editor row, or null when it is not usable yet:
// a complete #RRGGBB (uppercased) for colours, a number clamped to the token's range plus its unit.
export function parseTokenInput(def: TokenDef, raw: string): string | null {
  if (def.kind === 'color') return isHex(raw) ? raw.toUpperCase() : null;
  const n = parseFloat(raw);
  if (Number.isNaN(n)) return null;
  return Math.max(def.min, Math.min(def.max, n)) + def.unit;
}

export function toHex(v: string) {
  if (isHex(v)) return v;
  const m = v.match(/\d+/g);
  if (!m) return '#000000';
  return (
    '#' +
    m
      .slice(0, 3)
      .map((x) => (+x).toString(16).padStart(2, '0'))
      .join('')
  );
}
