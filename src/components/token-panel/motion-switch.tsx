'use client';

import { useId } from 'react';
import { useStaticMode } from '@/hooks/use-motion-off';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { setMotionOff } from '@/lib/motion';
import styles from './token-panel.module.css';

// "disable motion": stops every animation and transition, the bat's chase and the background
// ripple, and remembers the choice. It is the same switch ?static=1 flips for a single visit.
export function MotionSwitch() {
  const id = useId();
  const off = useStaticMode();
  const system = useReducedMotion();
  return (
    <div className={styles.switchRow}>
      <label htmlFor={id}>disable motion</label>
      <input
        aria-checked={off}
        checked={off}
        className={styles.switch}
        id={id}
        onChange={(e) => setMotionOff(e.target.checked)}
        role='switch'
        type='checkbox'
      />
      {system && <p className={styles.switchNote}># your system already asks for reduced motion</p>}
    </div>
  );
}
