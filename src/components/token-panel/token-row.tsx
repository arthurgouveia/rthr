'use client';

import { type ReactNode, useState } from 'react';
import { cx } from '@/lib/cx';
import { useAccent } from '@/lib/theme';
import {
  currentValue,
  isHex,
  numericValue,
  realName,
  type TokenDef,
  toHex,
  tokenLabel,
} from '@/lib/tokens';
import styles from './token-panel.module.css';

type Props = {
  def: TokenDef;
  id: string;
  changed: boolean;
  onSet: (def: TokenDef, raw: string) => void;
};

// The label and the highlight for a changed row; the controls are the children.
function RowShell({
  id,
  name,
  label,
  changed,
  children,
}: {
  id: string;
  name: string;
  label: string;
  changed: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cx(styles.row, changed && styles.changed)}>
      <label htmlFor={id} title={name}>
        {label}
      </label>
      {children}
    </div>
  );
}

// Row for one token: a colour picker with a hex field, or a slider with a number field. The current
// value is read from the live CSS variable, so the panel re-keys its rows when the theme or accent changes.
export function TokenRow({ def, id, changed, onSet }: Props) {
  const name = realName(def.name, useAccent());
  const value = currentValue(name);
  // What the text field shows while it is being typed in (and may not be valid yet).
  const [draft, setDraft] = useState<string | null>(null);
  const shell = { id, name, label: tokenLabel(def), changed };

  if (def.kind === 'color') {
    const hex = toHex(value);
    return (
      <RowShell {...shell}>
        <input id={id} onChange={(e) => onSet(def, e.target.value)} type='color' value={hex} />
        <input
          aria-label={`${name} hex`}
          maxLength={7}
          onBlur={() => setDraft(null)}
          onChange={(e) => {
            setDraft(e.target.value);
            if (isHex(e.target.value)) onSet(def, e.target.value);
          }}
          spellCheck={false}
          type='text'
          value={draft ?? hex}
        />
      </RowShell>
    );
  }

  const number = numericValue(value);
  return (
    <RowShell {...shell}>
      <input
        id={id}
        max={def.max}
        min={def.min}
        onChange={(e) => onSet(def, e.target.value)}
        type='range'
        value={number}
      />
      <input
        aria-label={`${name} in ${def.unit}`}
        max={def.max}
        min={def.min}
        onBlur={() => setDraft(null)}
        onChange={(e) => {
          setDraft(e.target.value);
          onSet(def, e.target.value);
        }}
        type='number'
        value={draft ?? number}
      />
    </RowShell>
  );
}
