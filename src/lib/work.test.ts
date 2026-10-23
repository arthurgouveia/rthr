import { describe, expect, it } from 'vitest';
import { content, type Job } from './content';
import { jobMonths } from './work';

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
});
