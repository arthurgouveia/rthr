'use client';

import { EarlierRoles } from '@/components/earlier-roles/earlier-roles';
import { JobEntry } from '@/components/job-entry/job-entry';
import { PageFrame } from '@/components/page-frame/page-frame';
import { Timeline } from '@/components/timeline/timeline';
import { content, pageById } from '@/lib/content';
import list from '@/styles/list.module.css';

const { command, title } = pageById('work');
const { jobs, earlier } = content.work;

// The work history as a timeline: recent jobs in full, the oldest folded into one table.
export function WorkView() {
  return (
    <PageFrame className={list.split} command={command} title={title}>
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region has to be focusable so the keyboard can scroll it, and nothing inside is a link or a button */}
      <section aria-label={title} className={list.list} tabIndex={0}>
        <Timeline>
          {jobs.map((job) => (
            <JobEntry job={job} key={job.slug} />
          ))}
          <EarlierRoles label={earlier.label} roles={earlier.roles} />
        </Timeline>
      </section>
    </PageFrame>
  );
}
