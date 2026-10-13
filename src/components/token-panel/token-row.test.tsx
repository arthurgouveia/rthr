import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TOKENS } from '@/lib/tokens';
import { TokenRow } from './token-row';

const color = TOKENS.colors[0];
const spacing = TOKENS.spacing[0];

describe('TokenRow', () => {
  it('applies a colour only once the hex is complete', () => {
    const onSet = vi.fn();
    render(<TokenRow changed={false} def={color} id='t' onSet={onSet} />);
    const hex = screen.getByLabelText('--bg hex');
    fireEvent.change(hex, { target: { value: '#12' } });
    expect(onSet).not.toHaveBeenCalled();
    fireEvent.change(hex, { target: { value: '#123456' } });
    expect(onSet).toHaveBeenCalledWith(color, '#123456');
  });

  it('sends slider and number changes', () => {
    const onSet = vi.fn();
    render(<TokenRow changed={false} def={spacing} id='t' onSet={onSet} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '12' } });
    expect(onSet).toHaveBeenLastCalledWith(spacing, '12');
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '7' } });
    expect(onSet).toHaveBeenLastCalledWith(spacing, '7');
  });
});
