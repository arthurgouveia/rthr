'use client';

import detail from '@/components/detail-panel/detail-panel.module.css';
import { ListPage } from '@/components/list-page/list-page';
import { ListRow } from '@/components/list-row/list-row';
import { content } from '@/lib/content';
import { cssVars } from '@/lib/css-vars';
import { longestWord } from '@/lib/text';
import ui from '@/styles/ui.module.css';
import styles from './projects-view.module.css';

export function ProjectsView() {
  return (
    <ListPage
      crawl={(project) => (
        <>
          <h2>{project.name}</h2>
          <p>{project.desc}</p>
          <a href={project.href} rel='noopener' tabIndex={-1}>
            {project.name} on GitHub
          </a>
        </>
      )}
      detail={(project) => (
        <>
          <span className='muted'>$ cat {project.name}/README.md</span>
          <h2 className={detail.heading} style={cssVars({ '--chars': longestWord(project.name) })}>
            {project.name}
          </h2>
          <p className={detail.desc}>{project.desc}</p>
          <dl className={detail.stats}>
            <div>
              <dt>lang</dt>
              <dd>{project.lang}</dd>
            </div>
            <div>
              <dt>stars</dt>
              <dd>{project.stars}</dd>
            </div>
            <div>
              <dt>forks</dt>
              <dd>{project.forks ?? '—'}</dd>
            </div>
          </dl>
          <a className={ui.btnOutline} href={project.href} rel='noopener'>
            open repo ↗
          </a>
        </>
      )}
      detailLabel={(project) => project.name}
      header={
        <li aria-hidden='true' className={styles.head}>
          <span>#</span>
          <span>name</span>
          <span>lang</span>
          <span>★</span>
        </li>
      }
      itemKey={(project) => project.name}
      items={content.projects}
      page='projects'
      row={(project, state) => (
        <ListRow
          {...state}
          className={styles.proj}
          lead={`0${content.projects.indexOf(project) + 1}`}
          leadClassName={styles.num}
        >
          <span className={styles.name}>{project.name}/</span>
          <span className={styles.lang}>{project.lang}</span>
          <span className={styles.stars}>
            <span className='sr'>stars </span>
            {project.stars}
          </span>
        </ListRow>
      )}
    />
  );
}
