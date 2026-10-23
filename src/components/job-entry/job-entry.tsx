import { ArrowList } from '@/components/arrow-list/arrow-list';
import { SkillList } from '@/components/skill-list/skill-list';
import { TimelineEntry, TimelineMeta } from '@/components/timeline/timeline';
import { buildInfo } from '@/lib/build-info';
import type { Job } from '@/lib/content';
import { capitalise, describeMonths, formatRange, monthsBetween } from '@/lib/dates';
import { jobMonths } from '@/lib/work';
import styles from './job-entry.module.css';

type Props = {
  job: Job;
  // The month ("YYYY-MM") that counts as now, for a job that has not ended.
  now?: string;
};

// One employer on the timeline: how long, when and where on the left; roles, what was done and
// the skills on the right. Roles are listed newest first, so the job spans the last one's start
// to the first one's end.
export function JobEntry({ job, now = buildInfo.month }: Props) {
  const first = job.roles[0];
  const last = job.roles[job.roles.length - 1];
  const current = !first.end;
  const months = jobMonths(job, now);
  const several = job.roles.length > 1;

  return (
    <TimelineEntry
      current={current}
      meta={
        <TimelineMeta
          details={[job.location, job.type]}
          label={months ? capitalise(describeMonths(months)) : undefined}
          range={formatRange(last.start, first.end)}
        />
      }
    >
      <article>
        <h2 className={styles.company}>{job.company}</h2>
        {job.roles.map((role) => {
          const roleMonths = monthsBetween(role.start, role.end, now);
          return (
            <p className={styles.role} key={role.title}>
              {role.title}
              {several && (
                <span className={styles.when}>
                  {formatRange(role.start, role.end)}
                  {roleMonths ? ` · ${describeMonths(roleMonths)}` : ''}
                </span>
              )}
            </p>
          );
        })}
        <p className={styles.summary}>{job.summary}</p>
        <ArrowList items={job.notes} />
        <SkillList skills={job.skills} />
      </article>
    </TimelineEntry>
  );
}
