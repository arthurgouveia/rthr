import { describe, expect, it } from 'vitest';
import { isStatic, setMotionOff } from './motion';

describe('setMotionOff', () => {
  it('puts html.static on and remembers it', () => {
    setMotionOff(true);
    expect(isStatic()).toBe(true);
    expect(localStorage.getItem('ag-motion')).toBe('off');
  });

  it('takes it off again and forgets it', () => {
    setMotionOff(true);
    setMotionOff(false);
    expect(isStatic()).toBe(false);
    expect(localStorage.getItem('ag-motion')).toBeNull();
  });
});
