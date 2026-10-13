'use client';

import { useEffect, useEffectEvent } from 'react';

type Options = {
  open: boolean;
  onDismiss: () => void;
  // A click on anything matching this selector counts as "inside" and does not dismiss.
  inside: string;
  // Escape handler; skipped when something else already handled the key (defaultPrevented).
  onEscape?: () => void;
};

// Light dismissal for non-modal panels: a pointer press outside them, and optionally Escape.
export function useDismiss({ open, onDismiss, inside, onEscape }: Options) {
  const dismiss = useEffectEvent(onDismiss);
  const handleEscape = useEffectEvent(() => onEscape?.());
  const hasEscape = Boolean(onEscape);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (e.target instanceof Element && !e.target.closest(inside)) dismiss();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) handleEscape();
    };
    document.addEventListener('pointerdown', onPointer);
    if (hasEscape) document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, inside, hasEscape]);
}
