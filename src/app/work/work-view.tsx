'use client';

import detail from '@/components/detail-panel/detail-panel.module.css';
import { ListPage } from '@/components/list-page/list-page';
import { ListRow } from '@/components/list-row/list-row';
import { content } from '@/lib/content';
import { cssVars } from '@/lib/css-vars';
import { cx } from '@/lib/cx';
import { longestWord } from '@/lib/text';
import styles from './work-view.module.css';

const STATUS_LABEL = { 'in-progress': 'IN PROGRESS', done: 'DONE' } as const;

export function WorkView() {
  return (
    <ListPage
      crawl={(job) => (
        <>
          <h2>{job.company}</h2>
          <p>
            {job.role}, {job.period}. {job.stack}
          </p>
          <ul>
            {job.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </>
      )}
      detail={(job) => (
        <>
          <span className='muted'>$ cat {job.slug}.log</span>
          <h2 className={detail.heading} style={cssVars({ '--chars': longestWord(job.company) })}>
            {job.company}
          </h2>
          <dl className={detail.kv}>
            <dt className='muted'>role</dt>
            <dd>{job.role}</dd>
            <dt className='muted'>period</dt>
            <dd>{job.period}</dd>
            <dt className='muted'>stack</dt>
            <dd>{job.stack}</dd>
          </dl>
          <ul className={detail.bullets}>
            {job.notes.map((note) => (
              <li key={note}>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      detailLabel={(job) => job.company}
      itemKey={(job) => job.slug}
      items={content.work.jobs}
      ordered
      page='work'
      row={(job, state) => (
        <ListRow {...state} className={styles.job} lead={job.period} leadClassName={styles.years}>
          <span className={styles.who}>
            <span className={styles.company}>{job.company}</span>
            <span className={styles.role}>{job.role}</span>
          </span>
          <span className={cx(styles.state, job.status === 'in-progress' && styles.inProgress)}>
            {STATUS_LABEL[job.status]}
          </span>
        </ListRow>
      )}
    />
  );
}
