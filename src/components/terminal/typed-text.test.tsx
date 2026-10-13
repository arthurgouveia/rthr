import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TypedText } from './typed-text';

describe('TypedText', () => {
  it('tells the CSS how many characters to type, when to start and how long the cursor lingers', () => {
    render(<TypedText at={12} linger={3} text='employer' />);
    const style = screen.getByText('employer').style;
    expect(style.getPropertyValue('--n')).toBe('8');
    expect(style.getPropertyValue('--at')).toBe('12');
    expect(style.getPropertyValue('--linger')).toBe('3');
  });

  it('keeps the decorative cursor out of the accessibility tree', () => {
    const { container } = render(<TypedText text='x' />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
