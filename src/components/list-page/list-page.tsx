'use client';

import type { ReactNode } from 'react';
import { DetailPanel } from '@/components/detail-panel/detail-panel';
import { PageFrame } from '@/components/page-frame/page-frame';
import { useDetailSelection } from '@/hooks/use-detail-selection';
import { type PageId, pageById } from '@/lib/content';
import list from '@/styles/list.module.css';

type RowState = {
  expanded: boolean;
  onSelect: () => void;
};

type Props<T> = {
  page: PageId;
  items: T[];
  itemKey: (item: T) => string;
  // Use an <ol> (ordered) or <ul>.
  ordered?: boolean;
  // Extra first row inside the list, e.g. a table header.
  header?: ReactNode;
  // One selectable row; wire it with <ListRow {...state}>.
  row: (item: T, state: RowState) => ReactNode;
  // The floating card for the selected item.
  detailLabel: (item: T) => string;
  detail: (item: T) => ReactNode;
  // The same item as plain markup for crawlers (the card only holds one at a time).
  crawl: (item: T) => ReactNode;
};

// The page layout shared by work and projects: a selectable list that opens a floating detail card.
export function ListPage<T>({
  page,
  items,
  itemKey,
  ordered,
  header,
  row,
  detailLabel,
  detail,
  crawl,
}: Props<T>) {
  const { command, title } = pageById(page);
  const selection = useDetailSelection();
  const selected = items[selection.index];
  const List = ordered ? 'ol' : 'ul';

  return (
    <>
      <PageFrame className={list.split} command={command} title={title}>
        <div className={list.list}>
          <List className={list.plain}>
            {header}
            {items.map((item, i) => (
              <li key={itemKey(item)}>
                {row(item, {
                  expanded: selection.open && i === selection.index,
                  onSelect: () => selection.select(i),
                })}
              </li>
            ))}
          </List>
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
