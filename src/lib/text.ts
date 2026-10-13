// Length of the longest unbreakable chunk: text only wraps at spaces and after hyphens.
export const longestWord = (s: string) =>
  Math.max(1, ...s.split(/\s+|(?<=-)/).map((w) => w.length));
