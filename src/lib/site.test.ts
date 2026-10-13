import { afterEach, describe, expect, it, vi } from 'vitest';

const load = async () => {
  vi.resetModules();
  return (await import('./site')).SITE_URL;
};

describe('SITE_URL', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('uses the Vercel production URL when there is no override', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'rthr.vercel.app');
    expect(await load()).toBe('https://rthr.vercel.app');
  });

  it('prefers the explicit override and strips trailing slashes', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.com//');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'rthr.vercel.app');
    expect(await load()).toBe('https://example.com');
  });
});
