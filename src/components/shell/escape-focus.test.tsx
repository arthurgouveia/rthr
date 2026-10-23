import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ProjectsView } from '@/app/projects/projects-view';
import { content } from '@/lib/content';
import { navigation } from '@/test/navigation';
import { Shell } from './shell';

const project = content.projects[1].name;

// The detail card and the customize panel are both non-modal and both close on Escape: the panel
// that was opened last has to take the key first, and focus has to return where it came from.
describe('Escape with both panels open', () => {
  it('closes the customize panel first, then the detail card, restoring focus each time', async () => {
    navigation.pathname = '/projects';
    render(
      <Shell>
        <ProjectsView />
      </Shell>,
    );
    await userEvent.click(screen.getByRole('button', { name: new RegExp(project) }));
    expect(screen.getByRole('dialog', { name: project })).toBeVisible();
    const customize = screen.getByRole('button', { name: 'customize me' });
    // Opened from the keyboard: a mouse click outside would (rightly) dismiss the card first.
    customize.focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('dialog', { name: /vim tokens.css/ })).toBeVisible();

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: /vim tokens.css/ })).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: project })).toBeVisible();
    expect(customize).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: project })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: new RegExp(project) })).toHaveFocus();
  });
});
