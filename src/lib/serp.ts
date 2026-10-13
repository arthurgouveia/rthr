import { content, type Page } from '@/lib/content';
import { pageTitle } from '@/lib/page-metadata';
import { SITE_URL } from '@/lib/site';

// What a Google result for one page will probably look like. Google decides the final snippet
// itself and often rewrites the description to fit the query, so these limits are the usual
// cut-offs (it truncates by pixel width, not characters), not guarantees.
export const TITLE_MAX = 60;
export const DESCRIPTION_MIN = 50;
export const DESCRIPTION_MAX = 160;

export type Serp = {
  id: Page['id'];
  title: string;
  url: string;
  description: string;
  problems: string[];
};

export const serpTitle = pageTitle;

// Cut at a word boundary and add an ellipsis, the way a result is shortened.
export const clip = (text: string, max: number) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 1)).trimEnd()}…`;
};

// "rthr.dev › work", the breadcrumb line shown above the title.
export const serpUrl = (path: string) =>
  [new URL(SITE_URL).host, ...path.split('/').filter(Boolean)].join(' › ');

export function serpFor(page: Page): Serp {
  const title = serpTitle(page);
  const { description } = page;
  const problems: string[] = [];
  if (title.length > TITLE_MAX) {
    problems.push(`title is ${title.length} characters; Google cuts it near ${TITLE_MAX}`);
  }
  if (!description.trim()) {
    problems.push('description is missing; Google will pick text from the page');
  } else if (description.length < DESCRIPTION_MIN) {
    problems.push(`description is ${description.length} characters; aim for ${DESCRIPTION_MIN}+`);
  } else if (description.length > DESCRIPTION_MAX) {
    problems.push(
      `description is ${description.length} characters; Google cuts it near ${DESCRIPTION_MAX}`,
    );
  }
  return {
    id: page.id,
    title: clip(title, TITLE_MAX),
    url: serpUrl(page.path),
    description: clip(description, DESCRIPTION_MAX),
    problems,
  };
}

// Every real page, with a problem added when two pages share a title or description.
export function serpResults(pages: Page[] = content.pages): Serp[] {
  const results = pages.map(serpFor);
  const dupes = (pick: (s: Serp) => string) => (s: Serp) =>
    results.filter((o) => pick(o) === pick(s)).length > 1;
  return results.map((s) => ({
    ...s,
    problems: [
      ...s.problems,
      ...(dupes((o) => o.title)(s) ? ['title is shared with another page'] : []),
      ...(dupes((o) => o.description)(s) ? ['description is shared with another page'] : []),
    ],
  }));
}
