import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { setMotionOff } from '@/lib/motion';
import { mockMatchMedia } from '@/test/media';
import { useMotionOff, useStaticMode } from './use-motion-off';

describe('useStaticMode', () => {
  it('follows html.static as the switch flips it', async () => {
    const { result } = renderHook(() => useStaticMode());
    expect(result.current).toBe(false);
    await act(async () => setMotionOff(true));
    expect(result.current).toBe(true);
    await act(async () => setMotionOff(false));
    expect(result.current).toBe(false);
  });
});

describe('useMotionOff', () => {
  it('is off for the switch, and on otherwise', async () => {
    const { result } = renderHook(() => useMotionOff());
    expect(result.current).toBe(false);
    await act(async () => setMotionOff(true));
    expect(result.current).toBe(true);
  });

  it('is off when the system asks for reduced motion', () => {
    mockMatchMedia('prefers-reduced-motion');
    expect(renderHook(() => useMotionOff()).result.current).toBe(true);
  });
});
