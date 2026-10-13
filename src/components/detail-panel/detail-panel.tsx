'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { useDismiss } from '@/hooks/use-dismiss';
import { cx } from '@/lib/cx';
import { DETAIL_ID, DETAIL_TRIGGER } from '@/lib/dom-ids';
import styles from './detail-panel.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
};

// The row that opened the card marks itself with aria-expanded.
const openerRow = () =>
  document.querySelector<HTMLElement>(`[${DETAIL_TRIGGER}][aria-expanded="true"]`);

// Floating card over a list. Non-modal: Esc, the × button or a click outside close it, and
// clicking another row (a trigger) just swaps its content. Closing with the keyboard or the
// button hands focus back to the row that opened it.
export function DetailPanel({ open, onClose, label, children }: Props) {
  const panel = useRef<HTMLDivElement>(null);

  // Focus the card when it opens, and again when another row swaps its content.
  // biome-ignore lint/correctness/useExhaustiveDependencies: label is the "content changed" signal
  useEffect(() => {
    if (open) panel.current?.focus();
  }, [open, label]);

  const closeAndReturnFocus = () => {
    const row = openerRow();
    onClose();
    row?.focus();
  };

  useDismiss({
    open,
    onDismiss: onClose,
    inside: `#${DETAIL_ID}, [${DETAIL_TRIGGER}]`,
    onEscape: closeAndReturnFocus,
  });

  return (
    <div
      aria-label={label}
      className={cx(styles.detail, 'fade')}
      hidden={!open}
      id={DETAIL_ID}
      ref={panel}
      role='dialog'
      tabIndex={-1}
    >
      <button
        aria-label='Close details'
        className={styles.close}
        onClick={closeAndReturnFocus}
        type='button'
      >
        ×
      </button>
      {children}
    </div>
  );
}
