import { buildInfo } from '@/lib/build-info';
import { content, type Job, type StatusSuffix } from '@/lib/content';
import { approximate, monthsBetween } from '@/lib/dates';

// Months at a job: from its oldest role's start to its newest role's end ("now" while it lasts).
// Roles are listed newest first. Undefined when the dates have no months.
export function jobMonths(job: Job, now: string = buildInfo.month) {
  const first = job.roles[0];
  const last = job.roles[job.roles.length - 1];
  return monthsBetween(last.start, first.end, now);
}

// What a status suffix shows (`label`) and says aloud (`spoken`). A string is used as written;
// { job } is how long I have been at that job, rounded down: "~1 yr", "~9 yrs". It is worked out from
// the same dates as the work timeline, so the two never disagree.
export function statusSuffix(
  suffix: StatusSuffix | undefined,
  now: string = buildInfo.month,
): { label: string; spoken: string } | undefined {
  if (suffix === undefined) return undefined;
  if (typeof suffix === 'string') return { label: suffix, spoken: suffix };
  const job = content.work.jobs.find((j) => j.slug === suffix.job);
  const months = job && jobMonths(job, now);
  return months ? approximate(months) : undefined;
}
