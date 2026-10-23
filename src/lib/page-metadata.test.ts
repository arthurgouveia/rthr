import { describe, expect, it } from 'vitest';
import { pageById } from './content';
import { pageMetadata, pageTitle } from './page-metadata';

describe('pageMetadata', () => {
  it('sets a canonical URL and page-specific Open Graph data', () => {
    const m = pageMetadata({
      ...pageById('work'),
      title: 'Work history',
      description: 'Roles and stacks.',
    });
    expect(m.alternates?.canonical).toBe('/work');
    expect(m.openGraph).toMatchObject({
      title: 'Work history — Arthur Gouveia',
      description: 'Roles and stacks.',
      url: '/work',
      type: 'website',
      siteName: 'Arthur Gouveia',
    });
  });

  it('points every page at the generated share image, for Open Graph and Twitter', () => {
    for (const id of ['index', 'work', 'projects', 'contact'] as const) {
      const m = pageMetadata(pageById(id));
      expect(m.openGraph).toMatchObject({
        images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
      });
      expect(m.twitter).toMatchObject({
        card: 'summary_large_image',
        images: ['/opengraph-image'],
      });
    }
  });

  it('titles the home page with the name and role, outside the site template', () => {
    const home = pageById('index');
    expect(pageTitle(home)).toBe('Arthur Gouveia — front-end developer');
    expect(pageMetadata(home).title).toEqual({ absolute: 'Arthur Gouveia — front-end developer' });
    expect(pageMetadata(home).description).toBe(home.description);
  });
});
