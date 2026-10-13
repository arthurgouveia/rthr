import { vi } from 'vitest';

// Replace navigator.clipboard. Pass a rejected promise to simulate a denied copy.
export const mockClipboard = (writeText = vi.fn().mockResolvedValue(undefined)) => {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  return writeText;
};
