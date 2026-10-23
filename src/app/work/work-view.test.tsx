import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { content } from '@/lib/content';
import { WorkView } from './work-view';

const { jobs, earlier } = content.work;

describe('WorkView', () => {
  it('shows every job on the timeline, newest first, and the earlier roles last', () => {
    render(<WorkView />);
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual([...jobs.map((j) => j.company), earlier.label]);
  });

  it('gives each job its dates, roles, notes and skills', () => {
    render(<WorkView />);
    const shopify = screen.getByRole('heading', { name: 'Shopify' }).closest('article');
    expect(shopify).not.toBeNull();
    const card = within(shopify as HTMLElement);
    expect(card.getByText('Senior Front End Developer')).toBeInTheDocument();
    expect(card.getByText('Front End Developer')).toBeInTheDocument();
    expect(card.getByText(/Polaris/)).toBeInTheDocument();
    expect(within(card.getByRole('list', { name: 'Skills' })).getByText('GraphQL')).toBeVisible();
  });

  it('lists a table row for every earlier role', () => {
    render(<WorkView />);
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('row')).toHaveLength(earlier.roles.length + 1);
    expect(table).toHaveTextContent('Lojas Maia — Intern');
  });
});
