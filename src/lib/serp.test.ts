import { describe, expect, it } from 'vitest';
import { content, type Page } from './content';
import { clip, DESCRIPTION_MAX, serpFor, serpResults, serpTitle, serpUrl, TITLE_MAX } from './serp';

const page = (over: Partial<Page>): Page => ({ ...content.pages[1], ...over });

describe('serp', () => {
  it('titles the home page with the bare name and the others with the template', () => {
    expect(serpTitle(content.pages[0])).toBe(`${content.site.name} — ${content.site.role}`);
    expect(serpTitle(page({ title: 'Work history' }))).toBe('Work history — Arthur Gouveia');
  });

  it('shows the host and path as a breadcrumb', () => {
    expect(serpUrl('/')).toMatch(/^[^›]+$/);
    expect(serpUrl('/work')).toMatch(/ › work$/);
  });

  it('clips at a word boundary with an ellipsis, and leaves short text alone', () => {
    expect(clip('short', 10)).toBe('short');
    const out = clip('one two three four', 12);
    expect(out).toBe('one two…');
    expect(out.length).toBeLessThanOrEqual(12);
  });

  it('flags a long title, and a missing, short or long description', () => {
    expect(serpFor(page({ title: 'x'.repeat(TITLE_MAX) })).problems[0]).toMatch(/title is/);
    expect(serpFor(page({ description: '' })).problems[0]).toMatch(/missing/);
    expect(serpFor(page({ description: 'too short' })).problems[0]).toMatch(/aim for/);
    expect(serpFor(page({ description: 'word '.repeat(40) })).problems[0]).toMatch(/cuts it/);
  });

  it('flags titles and descriptions shared between pages', () => {
    const a = page({ id: 'work', title: 'Same', description: 'd'.repeat(80) });
    const b = page({ id: 'projects', title: 'Same', description: 'd'.repeat(80) });
    const [first] = serpResults([a, b]);
    expect(first.problems).toEqual(
      expect.arrayContaining([
        'title is shared with another page',
        'description is shared with another page',
      ]),
    );
  });

  it('keeps every real page inside Google’s limits, with a unique title and description', () => {
    for (const result of serpResults()) {
      expect(result.problems, result.url).toEqual([]);
      expect(result.description.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
    }
  });
});
