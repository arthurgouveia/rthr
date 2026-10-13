'use client';

import { content } from '@/lib/content';
import { setTheme, useTheme } from '@/lib/theme';
import styles from './header.module.css';

type Props = {
  file: string;
};

export function Header({ file }: Props) {
  const theme = useTheme();
  return (
    <header className={styles.topbar}>
      <span className={styles.crumb}>
        <span className={styles.user}>{content.site.user}: </span>
        <b>~/{file}</b>
      </span>
      <button
        aria-label={`theme: ${theme}, switch to ${theme === 'dark' ? 'lame' : 'dark'}`}
        className={styles.themeButton}
        onClick={() => setTheme(theme === 'dark' ? 'lame' : 'dark')}
        type='button'
      >
        theme: <span className='accent'>{theme}</span> ⇄
      </button>
    </header>
  );
}
