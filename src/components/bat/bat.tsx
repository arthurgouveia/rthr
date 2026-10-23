'use client';

import { type RefObject, useEffect, useRef } from 'react';
import { useMotionOff } from '@/hooks/use-motion-off';
import styles from './bat.module.css';
import { BAT_FRAMES } from './frames';

type Props = {
  // The area the bat patrols and listens to for the pointer.
  areaRef: RefObject<HTMLElement | null>;
};

// While the pointer is over the area, hand its position to CSS (--x/--y); CSS does the easing.
export function Bat({ areaRef }: Props) {
  const reduced = useMotionOff();
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const area = areaRef.current;
    const el = wrap.current;
    if (!area || !el || reduced) return;

    const aim = (e: PointerEvent) => {
      const r = area.getBoundingClientRect();
      el.style.setProperty('--x', `${e.clientX - r.left}px`);
      el.style.setProperty('--y', `${e.clientY - r.top}px`);
      el.dataset.chasing = '';
    };
    const rest = () => {
      delete el.dataset.chasing;
      el.style.removeProperty('--x');
      el.style.removeProperty('--y');
    };
    const liftOff = (e: PointerEvent) => e.pointerType !== 'mouse' && rest();

    area.addEventListener('pointermove', aim);
    area.addEventListener('pointerdown', aim);
    area.addEventListener('pointerleave', rest);
    area.addEventListener('pointercancel', rest);
    area.addEventListener('pointerup', liftOff);
    return () => {
      rest();
      area.removeEventListener('pointermove', aim);
      area.removeEventListener('pointerdown', aim);
      area.removeEventListener('pointerleave', rest);
      area.removeEventListener('pointercancel', rest);
      area.removeEventListener('pointerup', liftOff);
    };
  }, [areaRef, reduced]);

  return (
    <div aria-hidden='true' className={styles.sky}>
      <div className={styles.wrap} ref={wrap}>
        <div className={styles.bat}>
          {BAT_FRAMES.map(({ pose, art }) => (
            <pre className={styles[pose]} key={pose}>
              {art}
            </pre>
          ))}
        </div>
      </div>
    </div>
  );
}
