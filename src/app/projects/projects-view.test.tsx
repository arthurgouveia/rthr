import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { content } from '@/lib/content';
import { languageLabel } from '@/lib/languages';
import { ProjectsView } from './projects-view';

const first = content.projects[0];
const second = content.projects[1];
const card = (name: string) => screen.getByRole('button', { name: new RegExp(name) });

describe('ProjectsView', () => {
  it('shows a card per project with its language, stars and forks', () => {
    render(<ProjectsView />);
    expect(screen.getAllByRole('button')).toHaveLength(content.projects.length);
    expect(card(second.name)).toHaveTextContent(languageLabel(second.lang));
    expect(card(second.name)).toHaveTextContent(`stars ${second.stars}`);
    expect(card(second.name)).toHaveTextContent(`forks ${second.forks}`);
    expect(card(second.name)).toHaveTextContent('public');
  });

  it('opens the README card with the year and a link to the repo', async () => {
    render(<ProjectsView />);
    await userEvent.click(card(first.name));
    const dialog = screen.getByRole('dialog', { name: first.name });
    expect(within(dialog).getByText(`$ cat ${first.name}/README.md`)).toBeInTheDocument();
    expect(within(dialog).getByText(String(first.year))).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: /open repo/ })).toHaveAttribute(
      'href',
      first.href,
    );
  });
});
