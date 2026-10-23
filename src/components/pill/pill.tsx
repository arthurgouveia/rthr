import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './pill.module.css';

type Props = {
  children: ReactNode;
  // Filled with the accent colour instead of outlined.
  filled?: boolean;
};

// A small rounded label, such as "public" or "fork" (outlined) or a length of time (filled).
export function Pill({ children, filled }: Props) {
  return <span className={cx(styles.pill, filled && styles.filled)}>{children}</span>;
}
