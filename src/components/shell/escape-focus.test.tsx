import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { WorkView } from '@/app/work/work-view';
import { content } from '@/lib/content';
import { navigation } from '@/test/navigation';
import { Shell } from './shell';

const company = content.work.jobs[1].company;

// The detail card and the customize panel are both non-modal and both close on Escape: the panel
// that was opened last has to take the key first, and focus has to return where it came from.
describe('Escape with both panels open', () => {
  it('closes the customize panel first, then the detail card, restoring focus each time', async () => {
    navigation.pathname = '/work';
    render(
      <Shell>
        <WorkView />
      </Shell>,
    );
    await userEvent.click(screen.getByRole('button', { name: new RegExp(company) }));
    expect(screen.getByRole('dialog', { name: company })).toBeVisible();
    const customize = screen.getByRole('button', { name: 'customize me' });
    // Opened from the keyboard: a mouse click outside would (rightly) dismiss the card first.
    customize.focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('dialog', { name: /vim tokens.css/ })).toBeVisible();

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: /vim tokens.css/ })).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: company })).toBeVisible();
    expect(customize).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: company })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: new RegExp(company) })).toHaveFocus();
  });
});
