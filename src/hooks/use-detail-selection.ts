'use client';

import { useState } from 'react';

// Which item of a list is selected, and whether its detail card is open. Selecting opens the card;
// the selection is kept after closing, so the card has content while it fades out.
export function useDetailSelection() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  return {
    index,
    open,
    select: (i: number) => {
      setIndex(i);
      setOpen(true);
    },
    close: () => setOpen(false),
  };
}
