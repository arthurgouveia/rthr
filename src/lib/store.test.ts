import { describe, expect, it, vi } from 'vitest';
import { store } from './store';

describe('store', () => {
  it('returns null for a missing key', () => {
    expect(store.get('missing')).toBeNull();
  });

  it('swallows storage errors', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(store.get('k')).toBeNull();
    expect(() => store.set('k', 'v')).not.toThrow();
  });
});
