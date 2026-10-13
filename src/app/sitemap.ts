import type { MetadataRoute } from 'next';
import { content } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return content.pages.map((p) => ({
    url: `${SITE_URL}${p.path === '/' ? '' : p.path}`,
    changeFrequency: 'monthly',
  }));
}
