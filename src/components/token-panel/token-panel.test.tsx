import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { setAccent, setTheme } from '@/lib/theme';
import { TokenPanel } from './token-panel';

const setup = () => {
  const onClose = vi.fn();
  render(<TokenPanel onClose={onClose} open />);
  return onClose;
};
const saved = () => JSON.parse(localStorage.getItem('ag-tokens') ?? '{}');
const overridesCss = () => document.getElementById('token-overrides')?.textContent ?? '';

describe('TokenPanel', () => {
  it('opens on the colours tab and switches tabs', async () => {
    setup();
    expect(screen.getByRole('button', { name: 'colors', pressed: true })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'spacing' }));
    expect(screen.getByRole('button', { name: 'spacing', pressed: true })).toBeInTheDocument();
    expect(screen.getByLabelText('--space-md in px')).toBeInTheDocument();
  });

  it('applies and saves a colour for the current theme only', () => {
    setup();
    fireEvent.change(screen.getByLabelText('--bg hex'), { target: { value: '#112233' } });
    expect(overridesCss()).toContain('--bg: #112233');
    expect(saved().dark['--bg']).toBe('#112233');
    expect(saved().lame['--bg']).toBeUndefined();
  });

  it('ignores an incomplete hex and uppercases a complete one', () => {
    setup();
    const hex = screen.getByLabelText('--bg hex');
    fireEvent.change(hex, { target: { value: '#12' } });
    expect(overridesCss()).toBe('');
    fireEvent.change(hex, { target: { value: '#abcdef' } });
    expect(saved().dark['--bg']).toBe('#ABCDEF');
  });

  it('saves the accent under the selected accent, per theme', () => {
    setAccent('flame');
    setTheme('lame');
    setup();
    fireEvent.change(screen.getByLabelText('--accent-flame hex'), { target: { value: '#123456' } });
    expect(saved().lame['--accent-flame']).toBe('#123456');
  });

  it('clamps sliders to the token range and keeps the unit', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'spacing' }));
    fireEvent.change(screen.getByLabelText('--space-md in px'), { target: { value: '9999' } });
    expect(saved().shared['--space-md']).toBe('40px');
    await userEvent.click(screen.getByRole('button', { name: 'motion' }));
    fireEvent.change(screen.getByLabelText('--duration-fast in ms'), { target: { value: '120' } });
    expect(saved().shared['--duration-fast']).toBe('120ms');
  });

  it('reset clears every override and the saved copy', () => {
    setup();
    fireEvent.change(screen.getByLabelText('--bg hex'), { target: { value: '#112233' } });
    fireEvent.click(screen.getByRole('button', { name: 'reset' }));
    expect(overridesCss()).toBe('');
    expect(saved()).toEqual({ shared: {}, dark: {}, lame: {} });
  });

  it('closes on Escape and says the key is handled, so other panels leave it alone', () => {
    const onClose = setup();
    const e = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    screen.getByRole('dialog').dispatchEvent(e);
    expect(onClose).toHaveBeenCalledOnce();
    expect(e.defaultPrevented).toBe(true);
  });

  it('closes on a click outside, but not on the footer button that opens it', () => {
    const onClose = setup();
    document.body.insertAdjacentHTML(
      'beforeend',
      '<button id="tokens-btn">customize</button><p id="x">x</p>',
    );
    fireEvent.pointerDown(document.getElementById('tokens-btn') as Element);
    fireEvent.pointerDown(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.pointerDown(document.getElementById('x') as Element);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('has a disable-motion switch on the motion tab only, that turns motion off and back on', async () => {
    setup();
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'motion' }));
    const toggle = screen.getByRole('switch', { name: 'disable motion' });
    expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    expect(toggle).toBeChecked();
    expect(document.documentElement).toHaveClass('static');
    expect(localStorage.getItem('ag-motion')).toBe('off');
    await userEvent.click(toggle);
    expect(document.documentElement).not.toHaveClass('static');
    expect(localStorage.getItem('ag-motion')).toBeNull();
  });

  it('leaves the motion choice alone when the tokens are reset', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'motion' }));
    await userEvent.click(screen.getByRole('switch', { name: 'disable motion' }));
    await userEvent.click(screen.getByRole('button', { name: 'reset' }));
    expect(document.documentElement).toHaveClass('static');
  });
});
