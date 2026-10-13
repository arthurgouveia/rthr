import { describe, expect, it } from 'vitest';
import { content } from '@/lib/content';
import { SITE_URL } from '@/lib/site';
import sitemap from './sitemap';

describe('sitemap', () => {
  it('lists every page, with the root as the bare origin', () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toHaveLength(content.pages.length);
    expect(urls).toContain(SITE_URL);
    expect(urls).toContain(`${SITE_URL}/work`);
    expect(urls.every((u) => !u.endsWith('/') || u === `${SITE_URL}/`)).toBe(true);
  });
});
