import type { ReactNode } from 'react';
import styles from './timeline.module.css';

// A vertical line with an entry hung off each dot: the dates on the left, the details on the right.
export function Timeline({ children }: { children: ReactNode }) {
  return <ol className={styles.timeline}>{children}</ol>;
}

type EntryProps = {
  // The left column: usually a <TimelineMeta>.
  meta: ReactNode;
  // The entry for now: its dot is filled and its label takes the accent colour.
  current?: boolean;
  children: ReactNode;
};

export function TimelineEntry({ meta, current, children }: EntryProps) {
  return (
    <li className={styles.entry} data-current={current ? '' : undefined}>
      <div className={styles.meta}>{meta}</div>
      <div aria-hidden='true' className={styles.rail}>
        <span className={styles.dot} />
      </div>
      <div className={styles.body}>{children}</div>
    </li>
  );
}

type MetaProps = {
  // How long, in words ("A year and a half"). Left out when the length is not known.
  label?: string;
  range: string;
  // Extra muted lines: where, and what kind of work.
  details?: (string | undefined)[];
};

export function TimelineMeta({ label, range, details = [] }: MetaProps) {
  return (
    <>
      {label && <p className={styles.label}>{label}</p>}
      <p className={styles.range}>{range}</p>
      {details.filter(Boolean).map((line) => (
        <p className={styles.detail} key={line}>
          {line}
        </p>
      ))}
    </>
  );
}
