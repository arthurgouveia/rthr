import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { content } from '@/lib/content';
import { HomeView } from './home-view';

describe('HomeView', () => {
  it('has the name as the page heading', () => {
    render(<HomeView />);
    expect(screen.getByRole('heading', { level: 1, name: content.site.name })).toBeInTheDocument();
  });

  it('has the whole status list as a definition list, even while it is still being typed', () => {
    render(<HomeView />);
    const list = document.querySelector('dl') as HTMLElement;
    expect(within(list).getAllByRole('term')).toHaveLength(content.index.status.length);
    expect(within(list).getAllByRole('definition')).toHaveLength(content.index.status.length);
  });
});
