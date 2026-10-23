import { describe, expect, it } from 'vitest';
import { content, lostPage, pageById, pageByPath } from './content';

describe('pageByPath', () => {
  it('ignores trailing slashes', () => {
    expect(pageByPath('/work/')?.id).toBe('work');
  });

  it('returns undefined for unknown paths', () => {
    expect(pageByPath('/nope')).toBeUndefined();
  });
});

describe('pageById', () => {
  it('throws for an id that is not in the content', () => {
    // @ts-expect-error not a real page id
    expect(() => pageById('nope')).toThrow(/unknown page/);
  });
});

describe('lostPage', () => {
  it('shows the bad path in the crumb and command', () => {
    const p = lostPage('/crypt/secrets');
    expect(p).toMatchObject({
      id: '404',
      file: 'crypt/secrets',
      command: 'cd /crypt/secrets',
      status: 'LOST',
    });
  });

  it('falls back to /dark-matter for the root path', () => {
    expect(lostPage('/').command).toBe('cd /dark-matter');
    expect(lostPage('').command).toBe('cd /dark-matter');
  });
});

// content.json is cast to its type, so these checks catch what the compiler cannot.
describe('content.json', () => {
  it('describes all four pages, each with a unique path', () => {
    expect(content.pages.map((p) => p.id)).toEqual(['index', 'work', 'projects', 'contact']);
    expect(new Set(content.pages.map((p) => p.path)).size).toBe(4);
    for (const p of content.pages) {
      for (const field of [p.num, p.file, p.tab, p.command, p.status, p.title, p.description]) {
        expect(field).toBeTruthy();
      }
    }
  });

  it('has no unfilled placeholders', () => {
    expect(JSON.stringify(content)).not.toMatch(/\[[A-Z ]+\]/);
  });

  it('gives every job and earlier role a unique slug, and valid dates', () => {
    const { jobs, earlier } = content.work;
    const slugs = [...jobs.map((j) => j.slug), ...earlier.roles.map((r) => r.slug)];
    expect(new Set(slugs).size).toBe(slugs.length);
    const date = /^\d{4}(-(0[1-9]|1[0-2]))?$/;
    const dates = [
      ...jobs.flatMap((j) => j.roles.flatMap((r) => [r.start, r.end ?? '2000'])),
      ...earlier.roles.flatMap((r) => [r.start, r.end]),
    ];
    for (const d of dates) expect(d).toMatch(date);
  });

  it('has exactly one current job, the first, and its roles run newest first', () => {
    const { jobs } = content.work;
    expect(jobs.filter((j) => j.roles.some((r) => !r.end))).toHaveLength(1);
    expect(jobs[0].roles[0].end).toBeUndefined();
    for (const job of jobs) {
      const starts = job.roles.map((r) => r.start);
      expect(starts).toEqual([...starts].sort().reverse());
    }
  });

  it('leads the projects with this repo and gives each one a year', () => {
    expect(content.projects[0].href).toBe(content.site.links.repo);
    for (const p of content.projects) expect(p.year).toBeGreaterThanOrEqual(2000);
  });

  it('links every project and contact row to a real URL', () => {
    for (const p of content.projects) expect(() => new URL(p.href)).not.toThrow();
    for (const r of content.contact.rows) expect(r.href).toMatch(/^(https?:|mailto:)/);
  });
});
