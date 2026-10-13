'use client';

import type { Ref } from 'react';
import { buildInfo } from '@/lib/build-info';
import { content } from '@/lib/content';
import { TOKENS_BUTTON_ID, TOKENS_ID } from '@/lib/dom-ids';
import { ACCENTS, setAccent, useAccent } from '@/lib/theme';
import { BranchIcon } from './branch-icon';
import styles from './footer.module.css';

type Props = {
  status: string;
  panelOpen: boolean;
  onTogglePanel: () => void;
  tokensButtonRef: Ref<HTMLButtonElement>;
};

export function Footer({ status, panelOpen, onTogglePanel, tokensButtonRef }: Props) {
  const accent = useAccent();
  return (
    <footer className={styles.statusbar}>
      <div className={styles.left}>
        <span className={styles.badge}>{status}</span>
        <span className={styles.version}>
          <a
            className={styles.branch}
            href={`${content.site.links.repo}/tree/${buildInfo.branch}`}
            rel='noopener'
          >
            <BranchIcon />
            {buildInfo.branch}
          </a>
          <span aria-hidden='true'>·</span>
          <a href={`${content.site.links.repo}/releases/tag/v${buildInfo.version}`} rel='noopener'>
            v{buildInfo.version}
          </a>
        </span>
      </div>
      <div className={styles.right}>
        <span className={styles.accentLabel} id='accent-label'>
          accent:
        </span>
        {/* biome-ignore lint/a11y/useSemanticElements: a div keeps the flex layout the design uses */}
        <div aria-labelledby='accent-label' className={styles.accents} role='group'>
          {ACCENTS.map((r) => (
            <button
              aria-label={r}
              aria-pressed={r === accent}
              className={styles.option}
              key={r}
              onClick={() => setAccent(r)}
              type='button'
            >
              <span aria-hidden='true' className={styles.swatch} data-accent={r} />
              <span aria-hidden='true' className={styles.accentName}>
                {r}
              </span>
            </button>
          ))}
        </div>
        <span aria-hidden='true' className={styles.sep}>
          ·
        </span>
        <button
          aria-controls={TOKENS_ID}
          aria-expanded={panelOpen}
          className={styles.customize}
          id={TOKENS_BUTTON_ID}
          onClick={onTogglePanel}
          ref={tokensButtonRef}
          type='button'
        >
          customize me
        </button>
        <span aria-hidden='true' className={styles.sep}>
          ·
        </span>
        <span>est. {content.site.established}</span>
      </div>
    </footer>
  );
}
