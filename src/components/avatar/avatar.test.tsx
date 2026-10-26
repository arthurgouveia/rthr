import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './avatar';

describe('Avatar', () => {
  it('is an image with an accessible name', () => {
    render(<Avatar label='Portrait of Arthur Gouveia' />);
    expect(screen.getByRole('img', { name: 'Portrait of Arthur Gouveia' })).toBeInTheDocument();
  });

  it('keeps the glint on the lenses out of the accessibility tree', () => {
    render(<Avatar label='Portrait of Arthur Gouveia' />);
    const glints = screen.getByRole('img').querySelector('svg');
    expect(glints).toHaveAttribute('aria-hidden', 'true');
    expect(glints).toHaveAttribute('focusable', 'false');
  });

  it('clips the glint to the lenses', () => {
    render(<Avatar label='Portrait of Arthur Gouveia' />);
    const root = screen.getByRole('img');
    const clip = root.querySelector('clipPath');
    expect(clip?.querySelector('path')).toBeInTheDocument();
    const clipped = root.querySelector(`[clip-path="url(#${clip?.id})"]`);
    expect(clipped?.querySelectorAll('path').length).toBeGreaterThan(0);
  });
});
