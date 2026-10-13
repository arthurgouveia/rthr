import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { content } from '@/lib/content';
import { WorkView } from './work-view';

const [current, previous, other] = content.work.jobs;
const row = (company: string, extra = {}) =>
  screen.getByRole('button', { name: new RegExp(company), ...extra });

describe('WorkView', () => {
  it('lists every job as a row with its status', () => {
    render(<WorkView />);
    expect(screen.getAllByRole('button')).toHaveLength(content.work.jobs.length);
    expect(screen.getAllByText('IN PROGRESS')).toHaveLength(1);
    expect(row(current.company)).toHaveTextContent('IN PROGRESS');
    expect(row(previous.company)).toHaveTextContent('DONE');
  });

  it('opens the detail dialog for the clicked job and marks its row expanded', async () => {
    render(<WorkView />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(row(previous.company));
    const dialog = screen.getByRole('dialog', { name: previous.company });
    expect(within(dialog).getByText(`$ cat ${previous.slug}.log`)).toBeInTheDocument();
    expect(row(previous.company, { expanded: true })).toBeInTheDocument();
  });

  it('swaps the detail when another job is clicked and closes on Escape', async () => {
    render(<WorkView />);
    await userEvent.click(row(previous.company));
    await userEvent.click(row(other.company));
    expect(screen.getByRole('dialog', { name: other.company })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { expanded: true })).not.toBeInTheDocument();
  });
});
