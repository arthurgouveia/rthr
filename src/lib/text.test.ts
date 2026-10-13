import { describe, expect, it } from 'vitest';
import { longestWord } from './text';

describe('longestWord', () => {
  it('measures a single word', () => {
    expect(longestWord('prettyCheckable')).toBe(15);
  });

  it('breaks on spaces', () => {
    expect(longestWord('Reliant Solutions')).toBe(9);
  });

  it('breaks after hyphens, keeping the hyphen with the word before it', () => {
    expect(longestWord('css-mix-blend-mode')).toBe(6);
  });

  it('never returns less than 1', () => {
    expect(longestWord('')).toBe(1);
  });
});
