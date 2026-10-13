import { act, renderHook } from '@testing-library/react';
import type { MouseEvent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { navigation } from '@/test/navigation';
import { useFadeNavigation } from './use-fade-navigation';

const click = (over: Partial<MouseEvent<HTMLAnchorElement>> = {}) =>
  ({ button: 0, preventDefault: vi.fn(), ...over }) as unknown as MouseEvent<HTMLAnchorElement>;

describe('useFadeNavigation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.documentElement.style.setProperty('--duration-fast', '150ms');
  });
  afterEach(() => vi.useRealTimers());

  it('fades out first, then navigates', () => {
    const { result } = renderHook(() => useFadeNavigation('/work'));
    const e = click();
    act(() => result.current.go(e, '/projects'));
    expect(e.preventDefault).toHaveBeenCalled();
    expect(result.current.leaving).toBe(true);
    expect(navigation.push).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(150));
    expect(navigation.push).toHaveBeenCalledWith('/projects');
  });

  it('shows the page again if the route never changes', () => {
    const { result } = renderHook(() => useFadeNavigation('/work'));
    act(() => result.current.go(click(), '/projects'));
    act(() => vi.advanceTimersByTime(150 + 2000));
    expect(result.current.leaving).toBe(false);
  });

  it('ends the fade when the route changes', () => {
    const { result, rerender } = renderHook(({ path }) => useFadeNavigation(path), {
      initialProps: { path: '/work' },
    });
    act(() => result.current.go(click(), '/projects'));
    rerender({ path: '/projects' });
    expect(result.current.leaving).toBe(false);
  });

  it('cancels the pending navigation on Back/forward', () => {
    const { result } = renderHook(() => useFadeNavigation('/work'));
    act(() => result.current.go(click(), '/projects'));
    act(() => window.dispatchEvent(new PopStateEvent('popstate')));
    act(() => vi.advanceTimersByTime(500));
    expect(result.current.leaving).toBe(false);
    expect(navigation.push).not.toHaveBeenCalled();
  });

  it('navigates immediately when there is no fade duration', () => {
    document.documentElement.style.setProperty('--duration-fast', '0ms');
    const { result } = renderHook(() => useFadeNavigation('/work'));
    act(() => result.current.go(click(), '/projects'));
    expect(navigation.push).toHaveBeenCalledWith('/projects');
    expect(result.current.leaving).toBe(false);
  });

  it('leaves modified clicks to the browser and ignores the current page', () => {
    const { result } = renderHook(() => useFadeNavigation('/work'));
    const modified = click({ ctrlKey: true });
    act(() => result.current.go(modified, '/projects'));
    expect(modified.preventDefault).not.toHaveBeenCalled();
    act(() => result.current.go(click(), '/work'));
    expect(result.current.leaving).toBe(false);
    expect(navigation.push).not.toHaveBeenCalled();
  });
});
