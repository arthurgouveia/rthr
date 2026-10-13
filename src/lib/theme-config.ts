// The themes and accents, in one place that both client code (theme.ts) and server code
// (the boot script, layout) can import. Adding an accent or a theme starts here.
export const THEMES = ['dark', 'lame'] as const;
export type Theme = (typeof THEMES)[number];
export const DEFAULT_THEME: Theme = 'dark';

export const ACCENTS = ['blood', 'flame', 'saffron'] as const;
export type Accent = (typeof ACCENTS)[number];
export const DEFAULT_ACCENT: Accent = 'blood';
