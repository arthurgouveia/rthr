import Link from 'next/link';
import type { MouseEvent } from 'react';
import { content, type Page } from '@/lib/content';

export type NavProps = {
  currentId: Page['id'];
  onNavigate: (e: MouseEvent<HTMLAnchorElement>, path: string) => void;
};

type Props = NavProps & {
  className: string;
  // Which label each page shows: the file name (sidebar) or the short tab name (tab bar).
  label: 'file' | 'tab';
};

export function NavLinks({ currentId, onNavigate, className, label }: Props) {
  return content.pages.map((p) => (
    <Link
      aria-current={p.id === currentId ? 'page' : undefined}
      className={className}
      href={p.path}
      key={p.id}
      onClick={(e) => onNavigate(e, p.path)}
    >
      <span>{p.num}</span>
      {p[label]}
    </Link>
  ));
}
