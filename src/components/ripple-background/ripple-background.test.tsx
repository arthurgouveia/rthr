import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockMatchMedia } from '@/test/media';
import { RippleBackground } from './ripple-background';

// jsdom has no canvas, so give it a context that records what is drawn.
const fakeContext = () => ({
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  setTransform: vi.fn(),
  fillStyle: '',
  globalAlpha: 1,
});

const useContext = (ctx: ReturnType<typeof fakeContext> | null) =>
  vi
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    // biome-ignore lint/suspicious/noExplicitAny: a stand-in for CanvasRenderingContext2D
    .mockReturnValue(ctx as any);

// jsdom has no ResizeObserver either.
beforeEach(() => {
  // jsdom lays nothing out: pretend the parent is 200 by 200
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width: 200,
    height: 200,
  } as DOMRect);
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.documentElement.classList.remove('static');
  document.documentElement.style.removeProperty('--accent');
});

describe('RippleBackground', () => {
  it('is a canvas hidden from assistive technology', () => {
    useContext(null);
    const { container } = render(<RippleBackground />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
  });

  it('draws nothing, and does not throw, when there is no canvas support', () => {
    useContext(null);
    expect(() => render(<RippleBackground />)).not.toThrow();
  });

  it('draws one still frame in the accent colour when motion is off', () => {
    const ctx = fakeContext();
    useContext(ctx);
    document.documentElement.classList.add('static');
    document.documentElement.style.setProperty('--accent', '#e0473c');
    const raf = vi.spyOn(window, 'requestAnimationFrame');
    render(<RippleBackground />);
    expect(ctx.clearRect).toHaveBeenCalled();
    expect(ctx.fillStyle).toBe('#e0473c');
    expect(raf).not.toHaveBeenCalled();
  });

  it('animates only when motion is allowed', () => {
    const ctx = fakeContext();
    useContext(ctx);
    mockMatchMedia('never-matches');
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);
    render(<RippleBackground />);
    expect(raf).toHaveBeenCalled();
  });

  it('asks for no animation frames when the visitor prefers reduced motion', () => {
    useContext(fakeContext());
    mockMatchMedia('prefers-reduced-motion');
    const raf = vi.spyOn(window, 'requestAnimationFrame');
    render(<RippleBackground />);
    expect(raf).not.toHaveBeenCalled();
  });

  it('stays a still frame when the disable-motion switch is on, then moves when it is off', () => {
    useContext(fakeContext());
    mockMatchMedia('never-matches');
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);
    document.documentElement.classList.add('static');
    const { unmount } = render(<RippleBackground />);
    expect(raf).not.toHaveBeenCalled();
    unmount();
    document.documentElement.classList.remove('static');
    render(<RippleBackground />);
    expect(raf).toHaveBeenCalled();
  });
});
