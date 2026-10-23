import styles from './arrow-list.module.css';

// A bulleted list whose bullets are the accent-coloured › of the terminal.
export function ArrowList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
