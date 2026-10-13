import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { content } from '@/lib/content';
import { Footer } from './footer';

const setup = (panelOpen = false) => {
  const onTogglePanel = vi.fn();
  render(
    <Footer
      onTogglePanel={onTogglePanel}
      panelOpen={panelOpen}
      status='PRESENTING'
      tokensButtonRef={createRef<HTMLButtonElement>()}
    />,
  );
  return onTogglePanel;
};

describe('Footer', () => {
  it('shows the page status badge and established year', () => {
    setup();
    expect(screen.getByText('PRESENTING')).toBeInTheDocument();
    expect(screen.getByText(`est. ${content.site.established}`)).toBeInTheDocument();
  });

  it('offers the accents as a labelled group of toggle buttons', async () => {
    setup();
    const group = screen.getByRole('group', { name: 'accent:' });
    expect(group.querySelectorAll('button')).toHaveLength(3);
    expect(screen.getByRole('button', { name: 'blood', pressed: true })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'flame' }));
    expect(screen.getByRole('button', { name: 'flame', pressed: true })).toBeInTheDocument();
  });

  it('reflects and toggles the customize panel', async () => {
    const toggle = setup(true);
    const btn = screen.getByRole('button', { name: 'customize me' });
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(btn).toHaveAttribute('aria-controls', 'tokens');
    await userEvent.click(btn);
    expect(toggle).toHaveBeenCalledOnce();
  });

  it('links the branch and the release for the build version', () => {
    setup();
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', expect.stringContaining('/tree/'));
    expect(links[1]).toHaveAttribute('href', expect.stringContaining('/releases/tag/v'));
  });
});
