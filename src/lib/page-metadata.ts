import type { Metadata } from 'next';
import { content, type Page } from '@/lib/content';

// The full <title> of a page: the home page says what Arthur does, the rest use the site template.
export const pageTitle = ({ id, title }: Pick<Page, 'id' | 'title'>) =>
  id === 'index'
    ? `${content.site.name} — ${content.site.role}`
    : `${title} — ${content.site.name}`;

// Title, description, canonical URL and Open Graph for one page, so each URL is described on its own.
export const pageMetadata = (page: Page): Metadata => ({
  title: page.id === 'index' ? { absolute: pageTitle(page) } : page.title,
  description: page.description,
  alternates: { canonical: page.path },
  // Next replaces the layout's openGraph object wholesale, so the site-wide fields are repeated here.
  openGraph: {
    type: 'website',
    siteName: content.site.name,
    title: pageTitle(page),
    description: page.description,
    url: page.path,
  },
});
