import type { CSSProperties } from 'react';

// Inline custom properties (--n, --at, --chars) for the CSS that reads them.
export const cssVars = (vars: Record<`--${string}`, string | number>) => vars as CSSProperties;
