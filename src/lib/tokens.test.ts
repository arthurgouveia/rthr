import { describe, expect, it } from 'vitest';
import { applyOverrides, bucketFor, isHex, loadOverrides, realName, TOKENS, toHex } from './tokens';

describe('isHex / toHex', () => {
  it('accepts only #RRGGBB', () => {
    expect(isHex('#a3241b')).toBe(true);
    expect(isHex('#A3241B')).toBe(true);
    expect(isHex('#fff')).toBe(false);
    expect(isHex('red')).toBe(false);
  });

  it('converts rgb() strings to hex', () => {
    expect(toHex('rgb(163, 36, 27)')).toBe('#a3241b');
  });

  it('passes hex through and falls back to black', () => {
    expect(toHex('#112233')).toBe('#112233');
    expect(toHex('nonsense')).toBe('#000000');
  });
});

describe('realName / bucketFor', () => {
  it('resolves accent to the selected accent', () => {
    expect(realName('accent', 'flame')).toBe('--accent-flame');
    expect(realName('--bg', 'flame')).toBe('--bg');
  });

  it('puts every colour (accent included) in the theme bucket and everything else in shared', () => {
    const o = { shared: {}, dark: {}, lame: {} };
    const bg = TOKENS.colors.find((t) => t.name === '--bg');
    const accent = TOKENS.colors.find((t) => t.name === 'accent');
    const space = TOKENS.spacing[0];
    expect(bg && bucketFor(o, bg, 'dark')).toBe(o.dark);
    expect(accent && bucketFor(o, accent, 'lame')).toBe(o.lame);
    expect(bucketFor(o, space, 'dark')).toBe(o.shared);
  });
});

describe('overrides', () => {
  it('loads empty overrides when nothing is stored or the JSON is bad', () => {
    expect(loadOverrides()).toEqual({ shared: {}, dark: {}, lame: {} });
    localStorage.setItem('ag-tokens', '{oops');
    expect(loadOverrides()).toEqual({ shared: {}, dark: {}, lame: {} });
  });

  it('writes a style element per bucket and persists', () => {
    applyOverrides({ shared: { '--space-md': '20px' }, dark: { '--bg': '#000000' }, lame: {} });
    const css = document.getElementById('token-overrides')?.textContent ?? '';
    expect(css).toContain(':root {\n  --space-md: 20px;\n}');
    expect(css).toContain(':root[data-theme="dark"] {\n  --bg: #000000;\n}');
    expect(css).not.toContain('lame');
    expect(loadOverrides().shared['--space-md']).toBe('20px');
  });

  it('reuses the same style element', () => {
    applyOverrides({ shared: {}, dark: {}, lame: {} });
    applyOverrides({ shared: { '--space-sm': '9px' }, dark: {}, lame: {} });
    expect(document.querySelectorAll('#token-overrides')).toHaveLength(1);
  });
});
