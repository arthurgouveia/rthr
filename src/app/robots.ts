import type { MetadataRoute } from 'next';
import { IS_PRODUCTION, SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return IS_PRODUCTION
    ? { rules: { userAgent: '*', allow: '/' }, sitemap: `${SITE_URL}/sitemap.xml` }
    : { rules: { userAgent: '*', disallow: '/' } };
}
