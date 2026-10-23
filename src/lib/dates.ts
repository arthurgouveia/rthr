// Dates in the content are 'YYYY-MM', or 'YYYY' when only the year is known.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WORDS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
  'twenty-one',
  'twenty-two',
  'twenty-three',
  'twenty-four',
  'twenty-five',
  'twenty-six',
  'twenty-seven',
  'twenty-eight',
  'twenty-nine',
  'thirty',
];

const hasMonth = (date: string) => /^\d{4}-\d{2}$/.test(date);

// Months since year 0, so two dates subtract.
const index = (date: string) => {
  const [year, month] = date.split('-').map(Number);
  return year * 12 + (month ? month - 1 : 0);
};

// "May 2025", or "2013" when the month is not known.
export const formatDate = (date: string) =>
  hasMonth(date) ? `${MONTHS[Number(date.slice(5)) - 1]} ${date.slice(0, 4)}` : date;

// "May 2025 – Present", "Sep 2007 – Sep 2012", or just "2013" when it starts and ends in one year.
export function formatRange(start: string, end: string | undefined) {
  if (end === start && !hasMonth(start)) return start;
  return `${formatDate(start)} – ${end ? formatDate(end) : 'Present'}`;
}

// Whole months from start to end, counting both of them: Apr to Sep is six months.
// Undefined when either date has no month.
export function monthsBetween(start: string, end: string | undefined, now: string) {
  const to = end ?? now;
  if (!hasMonth(start) || !hasMonth(to)) return undefined;
  return index(to) - index(start) + 1;
}

const years = (n: number) => (n === 1 ? 'a year' : `${WORDS[n]} years`);

// Whole years and a half: 6 -> "half a year", 18 -> "a year and a half", 90 -> "seven and a half years".
function inHalfYears(halves: number) {
  const whole = Math.floor(halves / 2);
  if (halves % 2 === 0) return years(whole);
  if (whole === 0) return 'half a year';
  return whole === 1 ? 'a year and a half' : `${WORDS[whole]} and a half years`;
}

// A length of time the way a person says it: "six months", "a year and a half", "just over five
// years", "almost seven and a half years". It rounds to the nearest half year.
export function describeMonths(months: number) {
  if (months < 12) return months === 1 ? 'a month' : `${WORDS[months]} months`;
  const halves = Math.floor(months / 6);
  const extra = months - halves * 6;
  if (extra === 0) return inHalfYears(halves);
  if (extra >= 4) return `almost ${inHalfYears(halves + 1)}`;
  // one or two months over a whole year is "just over"; over a half year (or three months) is "over"
  return `${extra <= 2 && halves % 2 === 0 ? 'just over' : 'over'} ${inHalfYears(halves)}`;
}

// One to thirty as a word; bigger numbers stay digits.
export const numberWord = (n: number) => WORDS[n] ?? String(n);

export const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
