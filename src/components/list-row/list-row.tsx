import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { DETAIL_ID, DETAIL_TRIGGER } from '@/lib/dom-ids';
import styles from './list-row.module.css';

type Props = {
  expanded: boolean;
  onSelect: () => void;
  // Grid layout and cell styles come from the list that uses the row.
  className: string;
  leadClassName: string;
  // The first cell's content; the › marker is attached to it.
  lead: ReactNode;
  children: ReactNode;
};

// A button that opens the floating detail card (see DetailPanel, which finds it by DETAIL_TRIGGER).
export function ListRow({ expanded, onSelect, className, leadClassName, lead, children }: Props) {
  return (
    <button
      {...{ [DETAIL_TRIGGER]: '' }}
      aria-controls={DETAIL_ID}
      aria-expanded={expanded}
      aria-haspopup='dialog'
      className={cx(styles.row, className)}
      onClick={onSelect}
      type='button'
    >
      <span className={cx(styles.lead, leadClassName)}>
        <span aria-hidden='true' className={styles.mark}>
          ›
        </span>
        {lead}
      </span>
      {children}
    </button>
  );
}
