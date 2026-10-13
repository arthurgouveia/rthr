import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { content } from '@/lib/content';
import { Sidebar } from './sidebar';
import { TabBar } from './tab-bar';

describe.each([
  ['Sidebar', Sidebar, 'file'],
  ['TabBar', TabBar, 'tab'],
] as const)('%s', (_name, Nav, label) => {
  it('links every page with real hrefs and marks the current one', () => {
    render(<Nav currentId='work' onNavigate={vi.fn()} />);
    const nav = screen.getByLabelText('Primary', { selector: 'nav' });
    for (const p of content.pages) {
      const link = nav.querySelector(`a[href="${p.path}"]`);
      expect(link).toHaveTextContent(p[label]);
      if (p.id === 'work') expect(link).toHaveAttribute('aria-current', 'page');
      else expect(link).not.toHaveAttribute('aria-current');
    }
  });

  it('reports clicks with the target path', async () => {
    const onNavigate = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
    render(<Nav currentId='index' onNavigate={onNavigate} />);
    await userEvent.click(
      screen.getByRole('link', { name: new RegExp(content.pages[2][label]), hidden: true }),
    );
    expect(onNavigate).toHaveBeenCalledWith(expect.anything(), '/projects');
  });
});
