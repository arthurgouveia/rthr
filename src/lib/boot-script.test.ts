import { describe, expect, it, vi } from 'vitest';
import { bootScript } from './boot-script';
import { ACCENTS } from './theme-config';

const run = (search = '') => {
  window.history.replaceState(null, '', `/${search}`);
  new Function(bootScript)();
};

describe('bootScript', () => {
  it('marks the document as JS-enabled and defaults to dark', () => {
    run();
    expect(document.documentElement).toHaveClass('js');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('restores a saved theme and accent', () => {
    localStorage.setItem('ag-theme', 'lame');
    localStorage.setItem('ag-accent', 'flame');
    run();
    expect(document.documentElement.dataset.theme).toBe('lame');
    expect(document.documentElement.dataset.accent).toBe('flame');
  });

  it('accepts every accent the app knows and rejects anything else', () => {
    for (const accent of ACCENTS) {
      document.documentElement.removeAttribute('data-accent');
      run(`?accent=${accent}`);
      expect(document.documentElement.dataset.accent).toBe(accent);
    }
    document.documentElement.removeAttribute('data-accent');
    run('?accent=teal');
    expect(document.documentElement.dataset.accent).toBeUndefined();
  });

  it('ignores an invalid saved theme', () => {
    localStorage.setItem('ag-theme', 'light');
    run();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('lets preview flags override the saved choice', () => {
    localStorage.setItem('ag-theme', 'dark');
    run('?theme=lame&accent=saffron');
    expect(document.documentElement.dataset.theme).toBe('lame');
    expect(document.documentElement.dataset.accent).toBe('saffron');
  });

  it('turns animations off with ?static=1', () => {
    run('?static=1');
    expect(document.documentElement).toHaveClass('static');
    document.documentElement.classList.remove('static');
    run();
    expect(document.documentElement).not.toHaveClass('static');
  });

  it('applies saved token overrides before first paint', () => {
    localStorage.setItem(
      'ag-tokens',
      JSON.stringify({ shared: { '--space-md': '20px' }, dark: { '--bg': '#000000' }, lame: {} }),
    );
    run();
    const css = document.getElementById('token-overrides')?.textContent ?? '';
    expect(css).toContain(':root{--space-md:20px;}');
    expect(css).toContain(':root[data-theme="dark"]{--bg:#000000;}');
  });

  it('copies the background into <meta name="theme-color">', () => {
    document.head.insertAdjacentHTML('beforeend', '<meta name="theme-color" content="#000">');
    document.documentElement.style.setProperty('--bg', '#123456');
    run();
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
      'content',
      '#123456',
    );
  });

  it('survives corrupt saved overrides and blocked storage', () => {
    localStorage.setItem('ag-tokens', '{oops');
    expect(() => run()).not.toThrow();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => run()).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('turns motion off when the customize panel saved that, and not otherwise', () => {
    run();
    expect(document.documentElement).not.toHaveClass('static');
    localStorage.setItem('ag-motion', 'off');
    run();
    expect(document.documentElement).toHaveClass('static');
  });
});
