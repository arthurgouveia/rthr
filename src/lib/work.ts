import { buildInfo } from '@/lib/build-info';
import type { Job } from '@/lib/content';
import { monthsBetween } from '@/lib/dates';

// Months at a job: from its oldest role's start to its newest role's end ("now" while it lasts).
// Roles are listed newest first. Undefined when the dates have no months.
export function jobMonths(job: Job, now: string = buildInfo.month) {
  const first = job.roles[0];
  const last = job.roles[job.roles.length - 1];
  return monthsBetween(last.start, first.end, now);
}
