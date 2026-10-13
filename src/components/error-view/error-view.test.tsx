import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { navigation } from '@/test/navigation';
import { ErrorView } from './error-view';

beforeEach(() => {
  navigation.pathname = '/crypt/secrets';
});

describe('ErrorView', () => {
  it('shows the 404 copy and a way home', () => {
    render(<ErrorView code='404' />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404 — page not found');
    expect(screen.getByText('nothing lives here. not even me.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cd ~/ })).toHaveAttribute('href', '/');
  });

  it('shows the 500 copy with the same layout', () => {
    render(<ErrorView code='500' />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('500 — server error');
    expect(
      screen.getByText('something right is wrong. what a scary place to be'),
    ).toBeInTheDocument();
  });

  it('renders a placeholder command on the server, then the real path once hydrated', async () => {
    // The server cannot know the bad URL (it renders /_not-found), so its HTML must not contain it.
    expect(renderToString(<ErrorView code='404' />)).toContain('cd /dark-matter');
    render(<ErrorView code='404' />);
    expect(await screen.findByText('cd /crypt/secrets')).toBeInTheDocument();
    expect(screen.queryByText('cd /dark-matter')).not.toBeInTheDocument();
  });

  it('keeps the decorative bat out of the accessibility tree', () => {
    render(<ErrorView code='404' />);
    expect(document.querySelector('pre')?.closest('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
