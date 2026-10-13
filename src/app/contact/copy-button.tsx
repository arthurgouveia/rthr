'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './copy-button.module.css';

// How long "copied ✓" stays before the button resets.
const RESET_MS = 1800;

type Props = {
  text: string;
};

export function CopyButton({ text }: Props) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<number>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      // Insecure context or permission denied: say so instead of pretending it worked.
      setState('failed');
    }
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), RESET_MS);
  };

  // The accessible name always contains the visible text (WCAG 2.5.3).
  const visible = state === 'copied' ? 'copied ✓' : state === 'failed' ? 'failed' : 'copy';
  const label = state === 'idle' ? `copy ${text}` : visible;

  return (
    <>
      <button aria-label={label} className={styles.copy} onClick={copy} type='button'>
        {visible}
      </button>
      <span aria-live='polite' className='sr'>
        {state === 'copied' && `${text} copied`}
        {state === 'failed' && 'copy failed, select the text instead'}
      </span>
    </>
  );
}
