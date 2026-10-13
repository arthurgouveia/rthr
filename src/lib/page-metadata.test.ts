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

  it('titles the home page with the name and role, outside the site template', () => {
    const home = pageById('index');
    expect(pageTitle(home)).toBe('Arthur Gouveia — front-end developer');
    expect(pageMetadata(home).title).toEqual({ absolute: 'Arthur Gouveia — front-end developer' });
    expect(pageMetadata(home).description).toBe(home.description);
  });
});
