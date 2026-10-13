import type { Redirect } from 'next/dist/lib/load-custom-routes';
import { SITE_URL } from './site';

// The old blog (arthurgouveia.com, a Jekyll site on GitHub Pages) and its .com.br twin now point
// here. Each old URL goes to its closest page in ONE permanent hop, so Google moves the old
// results to the new pages instead of treating them as dead ends. The old URL list came from its
// sitemap.xml and atom.xml; the per-post rules cover the eight posts it published.
export const LEGACY_HOSTS = [
  'arthurgouveia.com',
  'www.arthurgouveia.com',
  'arthurgouveia.com.br',
  'www.arthurgouveia.com.br',
] as const;

// Old path -> new path. A trailing slash and the .html variants are matched too.
export const LEGACY_PATHS: Record<string, string> = {
  '/about': '/',
  '/labs': '/projects',
  '/post/prettyCheckable-my-first-open-source': '/projects',
};

// Everything else on the old domains (the other seven posts, tag pages, the feed, odd URLs) has no
// equivalent on this site, so it lands on the home page.
export const LEGACY_FALLBACK = '/';

const to = (path: string) => `${SITE_URL}${path}`;

// SITE_URL must be the bare domain (https://rthr.dev, not www). If it ever points at one of the old
// hosts, redirecting those hosts to it would loop, so no legacy rules are made.
export function legacyRedirects(): Redirect[] {
  const { host } = new URL(SITE_URL);
  if ((LEGACY_HOSTS as readonly string[]).includes(host)) return [];
  const rules: Redirect[] = [];
  for (const host of LEGACY_HOSTS) {
    const has = [{ type: 'host' as const, value: host }];
    for (const [from, dest] of Object.entries(LEGACY_PATHS)) {
      rules.push({ source: from, has, destination: to(dest), permanent: true });
      rules.push({ source: `${from}.html`, has, destination: to(dest), permanent: true });
    }
    // Last for this host, so the specific rules above win.
    rules.push({ source: '/:path*', has, destination: to(LEGACY_FALLBACK), permanent: true });
  }
  // www.rthr.dev -> rthr.dev, so there is a single address for the site.
  rules.push({
    source: '/:path*',
    has: [{ type: 'host', value: `www.${host}` }],
    destination: `${SITE_URL}/:path*`,
    permanent: true,
  });
  return rules;
}
