import type { ReactNode } from 'react';
import styles from './pill.module.css';

// A small outlined label, such as "public" or "fork".
export function Pill({ children }: { children: ReactNode }) {
  return <span className={styles.pill}>{children}</span>;
}
