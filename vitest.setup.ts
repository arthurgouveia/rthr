import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { navigation } from './src/test/navigation';

// Every test gets the same fake router (see src/test/navigation.ts).
vi.mock('@/hooks/use-navigation', () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ push: navigation.push }),
}));

// jsdom has no matchMedia; default to "nothing matches" (desktop, motion allowed).
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  navigation.pathname = '/';
  navigation.push.mockClear();
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-accent');
  document.documentElement.removeAttribute('class');
  document.documentElement.removeAttribute('style');
  document.getElementById('token-overrides')?.remove();
  document.querySelector('meta[name="theme-color"]')?.remove();
});
