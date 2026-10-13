import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { navigation } from '@/test/navigation';
import { Shell } from './shell';

describe('Shell', () => {
  it('composes header, sidebar, main, footer and tab bar around the page', () => {
    navigation.pathname = '/work';
    render(
      <Shell>
        <p>page body</p>
      </Shell>,
    );
    expect(screen.getByRole('banner')).toHaveTextContent('~/work.log');
    expect(screen.getByRole('main')).toHaveTextContent('page body');
    expect(screen.getByRole('contentinfo')).toHaveTextContent('LOGGING');
    expect(screen.getAllByLabelText('Primary', { selector: 'nav' })).toHaveLength(2);
  });

  it('navigates when a nav link is clicked', async () => {
    navigation.pathname = '/work';
    render(<Shell>x</Shell>);
    await userEvent.click(screen.getAllByRole('link', { name: /projects/ })[0]);
    expect(navigation.push).toHaveBeenCalledWith('/projects');
  });

  it('shows the bad path and the LOST badge on unknown routes', async () => {
    navigation.pathname = '/crypt/secrets';
    render(<Shell>x</Shell>);
    expect(await screen.findByText('~/crypt/secrets')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toHaveTextContent('LOST');
    expect(document.querySelector('[aria-current]')).toBeNull();
  });

  it('opens the customize panel from the footer', async () => {
    render(<Shell>x</Shell>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'customize me' }));
    expect(screen.getByRole('dialog', { name: /vim tokens.css/ })).toBeVisible();
  });

  it('moves focus to <main> after a route change, but not on the first load', () => {
    navigation.pathname = '/work';
    const { rerender } = render(<Shell>x</Shell>);
    expect(screen.getByRole('main')).not.toHaveFocus();
    navigation.pathname = '/projects';
    rerender(<Shell>x</Shell>);
    expect(screen.getByRole('main')).toHaveFocus();
  });
});
