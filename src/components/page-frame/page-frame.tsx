import type { ReactNode } from 'react';
import { Command } from '@/components/terminal/command';
import { content } from '@/lib/content';
import { cssVars } from '@/lib/css-vars';
import { cx } from '@/lib/cx';

type Props = {
  // The typed shell command.
  command: string;
  // Page name for the visually hidden <h1>; omit when the page has a visible one.
  title?: string;
  className?: string;
  children: ReactNode;
};

// What every page shares: the typed command, then the page body, which rises in once the command
// has been typed (--at is the command's length in typing ticks).
export function PageFrame({ command, title, className, children }: Props) {
  return (
    <>
      <Command text={command} />
      {title && <h1 className='sr'>{`${title} — ${content.site.name}`}</h1>}
      <div className={cx('view', 'rise', className)} style={cssVars({ '--at': command.length })}>
        {children}
      </div>
    </>
  );
}
