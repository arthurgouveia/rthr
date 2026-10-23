import { ForkIcon } from '@/components/icons/fork-icon';
import { StarIcon } from '@/components/icons/star-icon';
import { LanguageDot } from '@/components/language-dot/language-dot';
import { Pill } from '@/components/pill/pill';
import { DETAIL_ID, DETAIL_TRIGGER } from '@/lib/dom-ids';
import styles from './project-card.module.css';

type Props = {
  name: string;
  desc: string;
  lang: string;
  stars: number;
  forks: number;
  // Set for a fork: the repo it came from, as owner/name.
  forkedFrom?: string;
  expanded: boolean;
  onSelect: () => void;
};

// One project as a card. A button that opens the floating detail card (see DetailPanel, which
// finds it by DETAIL_TRIGGER).
export function ProjectCard({
  name,
  desc,
  lang,
  stars,
  forks,
  forkedFrom,
  expanded,
  onSelect,
}: Props) {
  return (
    <button
      {...{ [DETAIL_TRIGGER]: '' }}
      aria-controls={DETAIL_ID}
      aria-expanded={expanded}
      aria-haspopup='dialog'
      className={styles.card}
      onClick={onSelect}
      type='button'
    >
      <span className={styles.top}>
        <span className={styles.name}>{name}</span>
        <Pill>{forkedFrom ? 'fork' : 'public'}</Pill>
      </span>
      {forkedFrom && <span className={styles.forked}>Forked from {forkedFrom}</span>}
      <span className={styles.desc}>{desc}</span>
      <span className={styles.meta}>
        <LanguageDot lang={lang} />
        <span className={styles.count}>
          <StarIcon />
          <span className='sr'>stars </span>
          {stars}
        </span>
        <span className={styles.count}>
          <ForkIcon />
          <span className='sr'>forks </span>
          {forks}
        </span>
      </span>
    </button>
  );
}
