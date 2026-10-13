import { ImageResponse } from 'next/og';
import { BRAND } from '@/lib/brand';
import { content } from '@/lib/content';
import { loadGoogleFont } from '@/lib/google-font';

export const alt = `${content.site.name} — ${content.site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const [pirata, mono] = await Promise.all([
    loadGoogleFont('Pirata One', content.site.name),
    loadGoogleFont(
      'JetBrains Mono',
      `$ whoami${content.site.role}${content.site.user}: ~/index.md est. ${content.site.established}`,
    ),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: BRAND.bg,
        color: BRAND.fg,
        fontFamily: 'JetBrains Mono',
        fontSize: 28,
      }}
    >
      <div style={{ display: 'flex' }}>
        <span style={{ color: BRAND.accent }}>$</span>
        <span style={{ marginLeft: 16 }}>whoami</span>
        <span style={{ marginLeft: 12, width: 16, height: 32, background: BRAND.accent }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{ fontFamily: 'Pirata One', fontSize: 200, lineHeight: 0.9, color: BRAND.strong }}
        >
          {content.site.name}
        </div>
        <div style={{ marginTop: 32, color: BRAND.soft }}>{content.site.role}</div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: BRAND.muted,
          fontSize: 24,
        }}
      >
        <span>{content.site.user}: ~/index.md</span>
        <span style={{ color: BRAND.accent }}>est. {content.site.established}</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Pirata One', data: pirata, weight: 400, style: 'normal' },
        { name: 'JetBrains Mono', data: mono, weight: 400, style: 'normal' },
      ],
    },
  );
}
