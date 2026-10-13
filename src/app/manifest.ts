import type { MetadataRoute } from 'next';
import { BRAND } from '@/lib/brand';
import { content } from '@/lib/content';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: content.site.name,
    short_name: content.site.name,
    description: `${content.site.name}, ${content.site.role}.`,
    start_url: '/',
    display: 'standalone',
    background_color: BRAND.bg,
    theme_color: BRAND.bg,
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
