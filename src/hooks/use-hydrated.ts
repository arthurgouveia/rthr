'use client';

import { useSyncExternalStore } from 'react';

// False on the server and during hydration, true afterwards.
export const useHydrated = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
