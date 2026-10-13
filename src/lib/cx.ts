// Join class names, skipping anything falsy: cx(styles.a, open && styles.open).
export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(' ');
