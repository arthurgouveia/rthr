import { languageLabel } from '@/lib/languages';
import styles from './language-dot.module.css';

// A coloured dot and the language's name.
export function LanguageDot({ lang }: { lang: string }) {
  return (
    <span className={styles.language}>
      <span aria-hidden='true' className={styles.dot} data-lang={lang} />
      {languageLabel(lang)}
    </span>
  );
}
