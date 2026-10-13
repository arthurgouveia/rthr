import { content } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

// schema.org markup that tells search engines who this site is about.
export const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: content.site.name,
      inLanguage: 'en',
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: content.site.name,
      url: SITE_URL,
      jobTitle: content.site.role,
      sameAs: [content.site.links.github, content.site.links.linkedin],
    },
  ],
};
