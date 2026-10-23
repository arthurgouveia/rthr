import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  applyOverrides,
  bucketFor,
  isHex,
  loadOverrides,
  numericValue,
  parseTokenInput,
  realName,
  TOKEN_TABS,
  TOKENS,
  toHex,
} from './tokens';

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

describe('canvas tokens', () => {
  const find = (name: string) => {
    const def = TOKENS.canvas.find((d) => d.name === name);
    if (!def) throw new Error(`no token ${name}`);
    return def;
  };

  it('has a canvas tab with opacity, size and speed', () => {
    expect(TOKEN_TABS).toContain('canvas');
    expect(TOKENS.canvas.map((d) => d.name)).toEqual([
      '--ripple-opacity',
      '--ripple-size',
      '--ripple-speed',
    ]);
  });

  it('stores opacity and speed as plain numbers, and size in px, all clamped', () => {
    expect(parseTokenInput(find('--ripple-opacity'), '0.35')).toBe('0.35');
    expect(parseTokenInput(find('--ripple-opacity'), '7')).toBe('1');
    expect(parseTokenInput(find('--ripple-speed'), '-2')).toBe('0');
    expect(parseTokenInput(find('--ripple-speed'), '1.5')).toBe('1.5');
    expect(parseTokenInput(find('--ripple-size'), '12')).toBe('12px');
    expect(parseTokenInput(find('--ripple-size'), '1')).toBe('4px');
  });
});

describe('TOKENS', () => {
  it('only lists variables that tokens.css defines', () => {
    const css = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf8');
    for (const defs of Object.values(TOKENS)) {
      for (const def of defs) {
        if (def.name === 'accent') continue; // stands for whichever --accent-* is selected
        expect(css, def.name).toContain(`${def.name}:`);
      }
    }
  });
});

describe('numericValue', () => {
  it('reads plain numbers and px and ms values as they are', () => {
    expect(numericValue('0.3')).toBe(0.3);
    expect(numericValue('12px')).toBe(12);
    expect(numericValue('55ms')).toBe(55);
  });

  it('turns seconds back into milliseconds (minified CSS writes 200ms as .2s)', () => {
    expect(numericValue('.2s')).toBe(200);
    expect(numericValue('0.4s')).toBe(400);
    expect(numericValue('1s')).toBe(1000);
  });

  it('is 0 for nothing', () => {
    expect(numericValue('')).toBe(0);
  });
});
