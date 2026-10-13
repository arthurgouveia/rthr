'use client';

import { useEffect, useRef, useState } from 'react';
import { useDismiss } from '@/hooks/use-dismiss';
import { TOKENS_BUTTON_ID, TOKENS_ID } from '@/lib/dom-ids';
import { useAccent, useTheme } from '@/lib/theme';
import { SCOPE, TOKEN_TABS, TOKENS, type TokenTab } from '@/lib/tokens';
import styles from './token-panel.module.css';
import { TokenRow } from './token-row';
import { useOverrides } from './use-overrides';

type Props = {
  open: boolean;
  onClose: () => void;
  initialTab?: TokenTab;
};

// "customize me": edit the design tokens live. Non-modal; Escape and a click outside close it.
export function TokenPanel({ open, onClose, initialTab }: Props) {
  const accent = useAccent();
  const theme = useTheme();
  const { set, reset, isChanged } = useOverrides();
  const [tab, setTab] = useState<TokenTab>(initialTab ?? 'colors');
  const tabRefs = useRef<Partial<Record<TokenTab, HTMLButtonElement | null>>>({});

  // Only focus the tab when the panel opens, not on every tab switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: tab is intentionally omitted
  useEffect(() => {
    if (open) tabRefs.current[tab]?.focus();
  }, [open]);

  useDismiss({ open, onDismiss: onClose, inside: `#${TOKENS_ID}, #${TOKENS_BUTTON_ID}` });

  return (
    <section
      aria-labelledby='tokens-title'
      className={styles.panel}
      hidden={!open}
      id={TOKENS_ID}
      onKeyDown={(e) => {
        if (e.key !== 'Escape') return;
        // Tell the detail card's Escape handler this key is already taken.
        e.preventDefault();
        onClose();
      }}
      role='dialog'
    >
      <div className={styles.head}>
        <h2 className={styles.title} id='tokens-title'>
          <span className='accent'>$</span> vim tokens.css
        </h2>
        <button
          aria-label='Close customize panel'
          className={styles.close}
          onClick={onClose}
          type='button'
        >
          ×
        </button>
      </div>
      <div className={styles.tabs}>
        {TOKEN_TABS.map((name) => (
          <button
            aria-pressed={name === tab}
            className={styles.tab}
            key={name}
            onClick={() => setTab(name)}
            ref={(el) => {
              tabRefs.current[name] = el;
            }}
            type='button'
          >
            {name}
          </button>
        ))}
      </div>
      <p className={styles.scope}># {SCOPE[tab]}</p>
      <div className={styles.list}>
        {open &&
          TOKENS[tab].map((def) => (
            <TokenRow
              changed={isChanged(def)}
              def={def}
              id={`tok-${def.name}`}
              key={`${tab}-${def.name}-${theme}-${accent}`}
              onSet={set}
            />
          ))}
      </div>
      <div className={styles.foot}>
        <button onClick={reset} type='button'>
          reset
        </button>
      </div>
    </section>
  );
}
