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

  it('gives jobs unique slugs, a valid status, and exactly one in progress', () => {
    const { jobs } = content.work;
    expect(new Set(jobs.map((j) => j.slug)).size).toBe(jobs.length);
    expect(jobs.every((j) => ['in-progress', 'done'].includes(j.status))).toBe(true);
    expect(jobs.filter((j) => j.status === 'in-progress')).toHaveLength(1);
  });

  it('links every project and contact row to a real URL', () => {
    for (const p of content.projects) expect(() => new URL(p.href)).not.toThrow();
    for (const r of content.contact.rows) expect(r.href).toMatch(/^(https?:|mailto:)/);
  });
});
