import type { Serp } from '@/lib/serp';
import styles from './serp-preview.module.css';

// One search result as Google will probably draw it, with a warning for anything that will be cut.
export function SerpPreview({ result }: { result: Serp }) {
  return (
    <li className={styles.result}>
      <p className={styles.url}>{result.url}</p>
      <p className={styles.title}>{result.title}</p>
      <p className={styles.description}>{result.description}</p>
      {result.problems.length > 0 && (
        <ul className={styles.problems}>
          {result.problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function SerpPreviewList({ results }: { results: Serp[] }) {
  return (
    <ul className={styles.list}>
      {results.map((r) => (
        <SerpPreview key={r.url} result={r} />
      ))}
    </ul>
  );
}
