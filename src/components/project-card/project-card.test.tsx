import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProjectCard } from './project-card';

const props = {
  name: 'bebop',
  desc: 'A boilerplate.',
  lang: 'css',
  stars: 24,
  forks: 3,
  expanded: false,
  onSelect: () => {},
};

describe('ProjectCard', () => {
  it('names the repo, its language and its counts', () => {
    render(<ProjectCard {...props} />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('bebop');
    expect(button).toHaveTextContent('CSS');
    expect(button).toHaveTextContent('stars 24');
    expect(button).toHaveTextContent('forks 3');
    expect(button).toHaveTextContent('public');
  });

  it('says where a fork came from and labels it a fork', () => {
    render(<ProjectCard {...props} forkedFrom='someone/bebop' />);
    expect(screen.getByRole('button')).toHaveTextContent('Forked from someone/bebop');
    expect(screen.getByRole('button')).toHaveTextContent('fork');
    expect(screen.getByRole('button')).not.toHaveTextContent('public');
  });

  it('reports its expanded state and selects on click', async () => {
    const onSelect = vi.fn();
    render(<ProjectCard {...props} expanded onSelect={onSelect} />);
    expect(screen.getByRole('button', { expanded: true })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledOnce();
  });
});
