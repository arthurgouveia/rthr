import { describe, expect, it } from 'vitest';
import { content } from './content';
import { LEGACY_FALLBACK, LEGACY_HOSTS, LEGACY_PATHS, legacyRedirects } from './legacy-redirects';
import { SITE_URL } from './site';

const newPaths = new Set(content.pages.map((p) => p.path));

describe('legacyRedirects', () => {
  const rules = legacyRedirects();
  const hostOf = (r: (typeof rules)[number]) => ((r.has ?? [])[0] as { value: string }).value;

  it('only sends visitors to real pages on this site, in one permanent hop', () => {
    for (const r of rules) {
      expect(r.permanent).toBe(true);
      expect(r.destination.startsWith(`${SITE_URL}/`)).toBe(true);
    }
    for (const dest of [...Object.values(LEGACY_PATHS), LEGACY_FALLBACK]) {
      expect(newPaths.has(dest)).toBe(true);
    }
  });

  it('covers every old host, with the catch-all last so specific rules win', () => {
    for (const host of LEGACY_HOSTS) {
      const mine = rules.filter((r) => hostOf(r) === host);
      expect(mine.at(-1)?.source).toBe('/:path*');
      expect(mine.slice(0, -1).every((r) => r.source !== '/:path*')).toBe(true);
    }
  });

  it('matches the .html variants of the old pages', () => {
    const sources = rules.map((r) => r.source);
    expect(sources).toContain('/about.html');
    expect(sources).toContain('/labs.html');
  });

  it('never redirects an old host to itself', () => {
    for (const r of rules) {
      expect((LEGACY_HOSTS as readonly string[]).includes(new URL(r.destination).host)).toBe(false);
    }
  });

  it('sends www to the bare domain, keeping the path', () => {
    const www = rules.find((r) => hostOf(r) === `www.${new URL(SITE_URL).host}`);
    expect(www?.destination).toBe(`${SITE_URL}/:path*`);
  });
});
