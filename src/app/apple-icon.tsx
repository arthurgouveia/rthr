import { ImageResponse } from 'next/og';
import { BRAND } from '@/lib/brand';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// The favicon's prompt chevron and accent cursor, for iOS home screens.
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        background: BRAND.bg,
        color: BRAND.fg,
        fontSize: 96,
        fontWeight: 700,
      }}
    >
      <span>{'>'}</span>
      <span style={{ width: 52, height: 14, background: BRAND.accent, marginTop: 40 }} />
    </div>,
    size,
  );
}
