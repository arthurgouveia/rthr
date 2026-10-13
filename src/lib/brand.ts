// The dark theme's colours as plain values, for the two places that cannot read CSS variables:
// the social-preview image renderer and <meta name="theme-color">. A test checks they match tokens.css.
export const BRAND = {
  bg: '#0d0c0a',
  fg: '#d8cfbd',
  strong: '#ede5d3',
  soft: '#b9b09e',
  muted: '#8c8473',
  accent: '#e0473c',
} as const;
