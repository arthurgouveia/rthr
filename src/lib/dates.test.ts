import { describe, expect, it } from 'vitest';
import { capitalise, describeMonths, formatDate, formatRange, monthsBetween } from './dates';

const NOW = '2026-10';

describe('dates', () => {
  it('formats a month, a year and a range', () => {
    expect(formatDate('2025-05')).toBe('May 2025');
    expect(formatDate('2013')).toBe('2013');
    expect(formatRange('2025-05', undefined)).toBe('May 2025 – Present');
    expect(formatRange('2007-09', '2012-09')).toBe('Sep 2007 – Sep 2012');
    expect(formatRange('2013', '2013')).toBe('2013');
    expect(formatRange('2013', '2014')).toBe('2013 – 2014');
  });

  it('counts both end months, and gives up when a month is missing', () => {
    expect(monthsBetween('2012-04', '2012-09', NOW)).toBe(6);
    expect(monthsBetween('2025-05', undefined, NOW)).toBe(18);
    expect(monthsBetween('2013', '2013', NOW)).toBeUndefined();
  });

  it.each([
    [1, 'a month'],
    [3, 'three months'],
    [6, 'six months'],
    [12, 'a year'],
    [14, 'just over a year'],
    [16, 'almost a year and a half'],
    [18, 'a year and a half'],
    [20, 'over a year and a half'],
    [61, 'just over five years'],
    [89, 'almost seven and a half years'],
    [108, 'nine years'],
    [228, 'nineteen years'],
  ])('says %i months as "%s"', (months, words) => {
    expect(describeMonths(months)).toBe(words);
  });

  it('capitalises the first letter only', () => {
    expect(capitalise('just over a year')).toBe('Just over a year');
  });
});
