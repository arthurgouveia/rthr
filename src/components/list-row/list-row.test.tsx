import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ListRow } from './list-row';

const setup = (expanded = false) => {
  const onSelect = vi.fn();
  render(
    <ListRow
      className='grid'
      expanded={expanded}
      lead='2015'
      leadClassName='first'
      onSelect={onSelect}
    >
      <span>Shopify</span>
    </ListRow>,
  );
  return onSelect;
};

describe('ListRow', () => {
  it('is a button that opens the detail dialog and reports whether it is open', () => {
    setup(true);
    const row = screen.getByRole('button', { name: /Shopify/ });
    expect(row).toHaveAttribute('aria-haspopup', 'dialog');
    expect(row).toHaveAttribute('aria-controls', 'detail');
    expect(row).toHaveAttribute('aria-expanded', 'true');
    expect(row).toHaveAttribute('data-detail-trigger');
  });

  it('calls onSelect when clicked', async () => {
    const onSelect = setup();
    await userEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledOnce();
  });
});
