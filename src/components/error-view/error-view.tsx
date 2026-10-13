'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { Bat } from '@/components/bat/bat';
import { PageFrame } from '@/components/page-frame/page-frame';
import { useSettledPath } from '@/hooks/use-current-page';
import { lostPage } from '@/lib/content';
import { cx } from '@/lib/cx';
import ui from '@/styles/ui.module.css';
import styles from './error-view.module.css';

const COPY = {
  '404': { description: 'page not found', message: 'nothing lives here. not even me.' },
  '500': {
    description: 'server error',
    message: 'something right is wrong. what a scary place to be',
  },
} as const;

type Props = {
  code: keyof typeof COPY;
};

// Shared by the 404 and 500 pages: the shell command, a huge status code, a line of copy and a way home.
export function ErrorView({ code }: Props) {
  const { description, message } = COPY[code];
  const area = useRef<HTMLDivElement>(null);
  const { command } = lostPage(useSettledPath());

  // Keyed by the command, so the typing restarts when the real path replaces the placeholder.
  return (
    <PageFrame className={styles.area} command={command} key={command}>
      <div className={styles.fill} ref={area}>
        <Bat areaRef={area} />
        <div className={styles.lost}>
          <h1 className={styles.code}>
            {code}
            <span className='sr'> — {description}</span>
          </h1>
          <p className={styles.message}>{message}</p>
          <Link className={cx(ui.btnOutline, styles.home)} href='/'>
            <span className={cx('accent', styles.prompt)}>$</span>cd ~
          </Link>
        </div>
      </div>
    </PageFrame>
  );
}
