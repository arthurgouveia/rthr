import { content } from '@/lib/content';
import { NavLinks, type NavProps } from './nav-links';
import styles from './sidebar.module.css';

export function Sidebar(props: NavProps) {
  return (
    <nav aria-label='Primary' className={styles.sidebar}>
      <span className={styles.home}>{content.site.home}</span>
      <NavLinks {...props} className={styles.link} label='file' />
      <div className={styles.spacer} />
      <div className={styles.meta}>
        <span>{content.site.location}</span>
        <span>
          <a href={content.site.links.github}>github</a> ·{' '}
          <a href={content.site.links.linkedin}>linkedin</a>
        </span>
      </div>
    </nav>
  );
}
