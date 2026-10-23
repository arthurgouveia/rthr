import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Pill } from './pill';

describe('Pill', () => {
  it('shows its text', () => {
    render(<Pill>public</Pill>);
    expect(screen.getByText('public')).toBeInTheDocument();
  });

  it('is filled only when asked', () => {
    const { rerender } = render(<Pill>~9 yrs</Pill>);
    const plain = screen.getByText('~9 yrs').className;
    rerender(<Pill filled>~9 yrs</Pill>);
    expect(screen.getByText('~9 yrs').className).not.toBe(plain);
  });
});
