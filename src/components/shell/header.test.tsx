import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Header } from './header';

describe('Header', () => {
  it('shows the crumb for the current file', () => {
    render(<Header file='work.log' />);
    expect(screen.getByText('~/work.log')).toBeInTheDocument();
  });

  it('names the current theme and the one it switches to, and updates when clicked', async () => {
    render(<Header file='index.md' />);
    const button = screen.getByRole('button', { name: 'theme: dark, switch to lame' });
    expect(button).toHaveTextContent('theme: dark');
    await userEvent.click(button);
    expect(screen.getByRole('button', { name: 'theme: lame, switch to dark' })).toHaveTextContent(
      'theme: lame',
    );
  });
});
