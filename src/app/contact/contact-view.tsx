import { PageFrame } from '@/components/page-frame/page-frame';
import { content, pageById } from '@/lib/content';
import styles from './contact-view.module.css';
import { CopyButton } from './copy-button';

export function ContactView() {
  const { command, title } = pageById('contact');
  const { heading, rows, footnote } = content.contact;
  return (
    <PageFrame className={styles.contact} command={command} title={title}>
      <h2 className={styles.summon}>{heading}</h2>
      <dl className={styles.rows}>
        {rows.map((row) => (
          <div className={styles.row} key={row.label}>
            <dt className={styles.label}>{row.label}</dt>
            <dd>
              <a href={row.href}>{row.text}</a>
            </dd>
            {row.copy && (
              <dd>
                <CopyButton text={row.text} />
              </dd>
            )}
          </div>
        ))}
      </dl>
      <span className='muted'>{footnote}</span>
    </PageFrame>
  );
}
