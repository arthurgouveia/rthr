import { describe, expect, it } from 'vitest';
import { content, type Job } from './content';
import { jobMonths, statusSuffix } from './work';

const job = (slug: string) => content.work.jobs.find((j) => j.slug === slug) as Job;

describe('work', () => {
  it('counts the months at a job from its oldest role to its newest', () => {
    // Shopify: Dec 2015 to Nov 2024, across two roles
    expect(jobMonths(job('shopify'), '2026-10')).toBe(108);
    // Scale Computing: May 2025 to now
    expect(jobMonths(job('scale-computing'), '2026-10')).toBe(18);
    expect(jobMonths(job('scale-computing'), '2027-04')).toBe(24);
  });

  it('has no length for a job whose months are not known', () => {
    expect(jobMonths(job('guestful'), '2026-10')).toBeUndefined();
  });

  it('words a status suffix: text as written, a job as roughly how long I was there', () => {
    expect(statusSuffix('new', '2026-10')).toEqual({ label: 'new', spoken: 'new' });
    expect(statusSuffix(undefined, '2026-10')).toBeUndefined();
    expect(statusSuffix({ job: 'shopify' }, '2026-10')).toEqual({
      label: '~9 yrs',
      spoken: 'about nine years',
    });
    // 18 months rounds down to a year
    expect(statusSuffix({ job: 'scale-computing' }, '2026-10')).toEqual({
      label: '~1 yr',
      spoken: 'about a year',
    });
    expect(statusSuffix({ job: 'scale-computing' }, '2027-04')?.label).toBe('~2 yrs');
    expect(statusSuffix({ job: 'scale-computing' }, '2025-10')?.label).toBe('~6 mo');
  });

  it('gives nothing for a job that does not exist or has no known length', () => {
    expect(statusSuffix({ job: 'nowhere' }, '2026-10')).toBeUndefined();
    expect(statusSuffix({ job: 'guestful' }, '2026-10')).toBeUndefined();
  });

  it('points every job suffix in the content at a real job', () => {
    for (const s of content.index.status) {
      if (typeof s.suffix === 'object') {
        expect(content.work.jobs.map((j) => j.slug)).toContain(s.suffix.job);
      }
    }
  });
});
