import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { content } from '@/lib/content';
import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  it('shows the portrait on top of the location, then the links', () => {
    render(<Sidebar currentId='work' onNavigate={vi.fn()} />);
    const portrait = screen.getByRole('img', { name: `Portrait of ${content.site.name}` });
    const location = screen.getByText(content.site.location);
    const github = screen.getByRole('link', { name: 'github' });
    const before = Node.DOCUMENT_POSITION_FOLLOWING;
    expect(portrait.compareDocumentPosition(location) & before).toBeTruthy();
    expect(location.compareDocumentPosition(github) & before).toBeTruthy();
    expect(portrait.parentElement).toBe(location.parentElement);
  });
});
