import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { content } from '@/lib/content';
import { ProjectsView } from './projects-view';

const noForks = content.projects.find((p) => p.forks === null);
const first = content.projects[0];
const row = (name: string) => screen.getByRole('button', { name: new RegExp(`${name}/`) });

describe('ProjectsView', () => {
  it('shows each project row with its language and star count', () => {
    render(<ProjectsView />);
    expect(screen.getAllByRole('button')).toHaveLength(content.projects.length);
    expect(row(first.name)).toHaveTextContent(first.lang);
    expect(row(first.name)).toHaveTextContent(`stars ${first.stars}`);
  });

  it('opens the README card with a link to the repo', async () => {
    render(<ProjectsView />);
    await userEvent.click(row(first.name));
    const dialog = screen.getByRole('dialog', { name: first.name });
    expect(within(dialog).getByText(`$ cat ${first.name}/README.md`)).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: /open repo/ })).toHaveAttribute(
      'href',
      first.href,
    );
  });

  it('shows a dash when the fork count is unknown', async () => {
    expect(noForks).toBeDefined();
    render(<ProjectsView />);
    await userEvent.click(row(noForks?.name ?? ''));
    expect(within(screen.getByRole('dialog')).getByText('—')).toBeInTheDocument();
  });
});
