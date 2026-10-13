import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Pirata_One } from 'next/font/google';
import { Shell } from '@/components/shell/shell';
import { bootScript } from '@/lib/boot-script';
import { BRAND } from '@/lib/brand';
import { content, pageById } from '@/lib/content';
import { GA_ID, IS_PRODUCTION, SITE_URL } from '@/lib/site';
import { structuredData } from '@/lib/structured-data';
import { DEFAULT_ACCENT, DEFAULT_THEME } from '@/lib/theme-config';
import '@/styles/tokens.css';
import '@/styles/base.css';

const pirata = Pirata_One({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-pirata-one',
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

// Escape < so the JSON can never close the script tag.
const jsonLd = { __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') };

const description = pageById('index').description;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: content.site.name, template: `%s — ${content.site.name}` },
  description,
  openGraph: {
    type: 'website',
    siteName: content.site.name,
    title: content.site.name,
    description,
  },
  twitter: { card: 'summary_large_image' },
  robots: IS_PRODUCTION ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: BRAND.bg,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={`${pirata.variable} ${mono.variable}`}
      data-accent={DEFAULT_ACCENT}
      data-theme={DEFAULT_THEME}
      lang='en'
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static boot script, no user input */}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD built from our own content */}
        <script dangerouslySetInnerHTML={jsonLd} type='application/ld+json' />
        <a className='skip' href='#main'>
          Skip to content
        </a>
        <Shell>{children}</Shell>
        <Analytics />
        <SpeedInsights />
        {IS_PRODUCTION && GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
