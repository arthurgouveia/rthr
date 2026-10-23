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

  it('puts a line break between the lines of the tagline', () => {
    render(<HomeView />);
    const tagline = document.querySelector('h1 + p') as HTMLElement;
    const lines = content.index.tagline;
    expect(lines.length).toBeGreaterThan(1);
    expect(tagline.querySelectorAll('br')).toHaveLength(lines.length - 1);
    expect(tagline.textContent).toBe(lines.join(''));
  });

  it('shows how long I have been at each job as a pill after its name', () => {
    render(<HomeView />);
    const withJob = content.index.status.filter((s) => typeof s.suffix === 'object');
    expect(withJob.length).toBeGreaterThanOrEqual(2);
    for (const s of withJob) {
      const term = screen.getByText(s.key);
      const value = term.closest('div')?.querySelector('dd') as HTMLElement;
      expect(value).toHaveTextContent(s.value);
      // shown as "~9 yrs", said as "Shopify for about nine years"
      expect(value.textContent).toMatch(new RegExp(`^${s.value} for about \\w+.*~\\d+ (yrs?|mo)$`));
      expect(value.querySelector('[aria-hidden="true"]')?.textContent).toMatch(/^~\d+ (yrs?|mo)$/);
    }
  });

  it('leaves the other status lines without a pill', () => {
    render(<HomeView />);
    const plain = content.index.status.filter((s) => !s.suffix);
    for (const s of plain) {
      const value = screen.getByText(s.key).closest('div')?.querySelector('dd') as HTMLElement;
      expect(value.textContent).toBe(s.value);
    }
  });
});
