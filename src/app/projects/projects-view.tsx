'use client';

import { CardGridPage } from '@/components/card-grid-page/card-grid-page';
import detail from '@/components/detail-panel/detail-panel.module.css';
import { ProjectCard } from '@/components/project-card/project-card';
import { content } from '@/lib/content';
import { cssVars } from '@/lib/css-vars';
import { languageLabel } from '@/lib/languages';
import { longestWord } from '@/lib/text';
import ui from '@/styles/ui.module.css';

export function ProjectsView() {
  return (
    <CardGridPage
      card={(project, state) => (
        <ProjectCard
          {...state}
          desc={project.desc}
          forkedFrom={project.forkedFrom}
          forks={project.forks}
          lang={project.lang}
          name={project.name}
          stars={project.stars}
        />
      )}
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
              <dd>{languageLabel(project.lang)}</dd>
            </div>
            <div>
              <dt>year</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>stars</dt>
              <dd>{project.stars}</dd>
            </div>
            <div>
              <dt>forks</dt>
              <dd>{project.forks}</dd>
            </div>
          </dl>
          <a className={ui.btnOutline} href={project.href} rel='noopener'>
            open repo ↗
          </a>
        </>
      )}
      detailLabel={(project) => project.name}
      itemKey={(project) => project.name}
      items={content.projects}
      page='projects'
    />
  );
}
