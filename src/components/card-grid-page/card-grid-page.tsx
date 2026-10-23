'use client';

import type { ReactNode } from 'react';
import { DetailPanel } from '@/components/detail-panel/detail-panel';
import { PageFrame } from '@/components/page-frame/page-frame';
import { useDetailSelection } from '@/hooks/use-detail-selection';
import { type PageId, pageById } from '@/lib/content';
import list from '@/styles/list.module.css';

type CardState = {
  expanded: boolean;
  onSelect: () => void;
};

type Props<T> = {
  page: PageId;
  items: T[];
  itemKey: (item: T) => string;
  // One selectable card; wire it with <ProjectCard {...state}>.
  card: (item: T, state: CardState) => ReactNode;
  // The floating card for the selected item.
  detailLabel: (item: T) => string;
  detail: (item: T) => ReactNode;
  // The same item as plain markup for crawlers (the floating card only holds one at a time).
  crawl: (item: T) => ReactNode;
};

// A page of selectable cards in a grid; selecting one opens a floating detail card.
export function CardGridPage<T>({
  page,
  items,
  itemKey,
  card,
  detailLabel,
  detail,
  crawl,
}: Props<T>) {
  const { command, title } = pageById(page);
  const selection = useDetailSelection();
  const selected = items[selection.index];

  return (
    <>
      <PageFrame className={list.split} command={command} title={title}>
        <div className={list.list}>
          <ul className={list.grid}>
            {items.map((item, i) => (
              <li key={itemKey(item)}>
                {card(item, {
                  expanded: selection.open && i === selection.index,
                  onSelect: () => selection.select(i),
                })}
              </li>
            ))}
          </ul>
        </div>
      </PageFrame>
      {/* Outside the animated page body: an animated transform would make that body the card's containing block. */}
      <DetailPanel label={detailLabel(selected)} onClose={selection.close} open={selection.open}>
        {detail(selected)}
      </DetailPanel>
      <div aria-hidden='true' className='sr'>
        {items.map((item) => (
          <article key={itemKey(item)}>{crawl(item)}</article>
        ))}
      </div>
    </>
  );
}
