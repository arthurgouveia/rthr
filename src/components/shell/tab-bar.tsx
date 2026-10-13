import { NavLinks, type NavProps } from './nav-links';
import styles from './tab-bar.module.css';

// Phone-only replacement for the sidebar.
export function TabBar(props: NavProps) {
  return (
    <nav aria-label='Primary' className={styles.tabbar}>
      <NavLinks {...props} className={styles.link} label='tab' />
    </nav>
  );
}
