'use client';

import { useEffect, useState } from 'react';
import { useAccent, useTheme } from '@/lib/theme';
import {
  applyOverrides,
  bucketFor,
  emptyOverrides,
  loadOverrides,
  type Overrides,
  parseTokenInput,
  realName,
  type TokenDef,
} from '@/lib/tokens';

// The customize panel's saved edits: loads what is in storage, applies and saves each change,
// and can clear everything. Colours are stored per theme, other tokens are shared.
export function useOverrides() {
  const accent = useAccent();
  const theme = useTheme();
  const [overrides, setOverrides] = useState<Overrides>(emptyOverrides);

  // The boot script has already applied saved overrides; load them here so the panel can edit them.
  useEffect(() => {
    setOverrides(loadOverrides());
  }, []);

  const set = (def: TokenDef, raw: string) => {
    const value = parseTokenInput(def, raw);
    if (value === null) return;
    const next = structuredClone(overrides);
    bucketFor(next, def, theme)[realName(def.name, accent)] = value;
    applyOverrides(next);
    setOverrides(next);
  };

  const reset = () => {
    const next = emptyOverrides();
    applyOverrides(next);
    setOverrides(next);
  };

  const isChanged = (def: TokenDef) =>
    realName(def.name, accent) in bucketFor(overrides, def, theme);

  return { set, reset, isChanged };
}
