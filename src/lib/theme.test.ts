import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { setAccent, setTheme, useAccent, useTheme } from './theme';

describe('theme store', () => {
  it('setTheme writes the attribute and persists it', () => {
    setTheme('lame');
    expect(document.documentElement.dataset.theme).toBe('lame');
    expect(localStorage.getItem('ag-theme')).toBe('lame');
  });

  it('setAccent writes the attribute and persists it', () => {
    setAccent('flame');
    expect(document.documentElement.dataset.accent).toBe('flame');
    expect(localStorage.getItem('ag-accent')).toBe('flame');
  });

  it('keeps <meta name="theme-color"> in sync', () => {
    document.head.insertAdjacentHTML('beforeend', '<meta name="theme-color" content="#000">');
    document.documentElement.style.setProperty('--bg', '#123456');
    setTheme('dark');
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
      'content',
      '#123456',
    );
    document.querySelector('meta[name="theme-color"]')?.remove();
    document.documentElement.style.removeProperty('--bg');
  });

  it('useTheme and useAccent follow the root attributes and update on change', () => {
    const theme = renderHook(() => useTheme());
    const accent = renderHook(() => useAccent());
    expect(theme.result.current).toBe('dark');
    expect(accent.result.current).toBe('blood');
    act(() => setTheme('lame'));
    act(() => setAccent('saffron'));
    expect(theme.result.current).toBe('lame');
    expect(accent.result.current).toBe('saffron');
  });

  it('falls back to defaults for unknown attribute values', () => {
    document.documentElement.dataset.theme = 'purple';
    document.documentElement.dataset.accent = 'teal';
    expect(renderHook(() => useTheme()).result.current).toBe('dark');
    expect(renderHook(() => useAccent()).result.current).toBe('blood');
  });
});
