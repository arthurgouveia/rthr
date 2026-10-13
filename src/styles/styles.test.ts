import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BRAND } from '@/lib/brand';

const root = join(process.cwd(), 'src');
const cssFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return cssFiles(path);
    return path.endsWith('.css') ? [path] : [];
  });
const files = cssFiles(root);
const withoutComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

// The breakpoint table in tokens.css: CSS variables cannot be used in @media conditions, so the
// values are repeated, and this keeps them from drifting.
const ALLOWED_MEDIA = new Set([
  '(max-width: 767px)',
  '(min-width: 768px)',
  '(max-width: 1199px)',
  '(max-height: 520px)',
  '(max-height: 400px)',
  '(prefers-reduced-motion: reduce)',
  '(forced-colors: active)',
]);

describe('stylesheets', () => {
  it('only use the documented @media conditions', () => {
    const used = files.flatMap((f) =>
      [...withoutComments(readFileSync(f, 'utf8')).matchAll(/@media\s+([^{]+)\{/g)].map((m) =>
        m[1].trim(),
      ),
    );
    expect(used.length).toBeGreaterThan(0);
    expect(used.filter((q) => !ALLOWED_MEDIA.has(q))).toEqual([]);
  });

  it('contain no raw colours outside tokens.css', () => {
    const offenders = files
      .filter((f) => !f.endsWith('tokens.css'))
      .filter((f) =>
        /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i.test(withoutComments(readFileSync(f, 'utf8'))),
      );
    expect(offenders).toEqual([]);
  });

  it('keep lib/brand.ts in step with the dark theme in tokens.css', () => {
    const tokens = readFileSync(join(root, 'styles/tokens.css'), 'utf8');
    const dark = tokens.slice(tokens.indexOf('/* ---- Dark'), tokens.indexOf('/* ---- Lame'));
    const value = (name: string) =>
      dark.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1].toLowerCase();
    expect(value('bg')).toBe(BRAND.bg);
    expect(value('fg')).toBe(BRAND.fg);
    expect(value('strong')).toBe(BRAND.strong);
    expect(value('soft')).toBe(BRAND.soft);
    expect(value('muted')).toBe(BRAND.muted);
    expect(value('accent-blood')).toBe(BRAND.accent);
  });
});
