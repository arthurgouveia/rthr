import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mockMatchMedia } from '@/test/media';
import { useReducedMotion } from './use-reduced-motion';

describe('useReducedMotion', () => {
  it('is false by default', () => {
    expect(renderHook(() => useReducedMotion()).result.current).toBe(false);
  });

  it('follows the prefers-reduced-motion media query', () => {
    mockMatchMedia('prefers-reduced-motion');
    expect(renderHook(() => useReducedMotion()).result.current).toBe(true);
  });
});
