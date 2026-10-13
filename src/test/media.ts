import { vi } from 'vitest';

// Make matchMedia answer true for queries containing `match` (e.g. 'prefers-reduced-motion').
export const mockMatchMedia = (match: string) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes(match),
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
};
