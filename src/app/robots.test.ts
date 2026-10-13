import { afterEach, describe, expect, it, vi } from 'vitest';

const load = async () => {
  vi.resetModules();
  return (await import('./robots')).default();
};

describe('robots', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('allows crawling and links the sitemap in production', async () => {
    vi.stubEnv('VERCEL_ENV', 'production');
    const r = await load();
    expect(r.rules).toEqual({ userAgent: '*', allow: '/' });
    expect(r.sitemap).toMatch(/\/sitemap\.xml$/);
  });

  it('keeps preview deploys out of search', async () => {
    vi.stubEnv('VERCEL_ENV', 'preview');
    const r = await load();
    expect(r.rules).toEqual({ userAgent: '*', disallow: '/' });
    expect(r.sitemap).toBeUndefined();
  });
});
