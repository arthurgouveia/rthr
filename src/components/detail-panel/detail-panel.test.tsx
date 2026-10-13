import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DetailPanel } from './detail-panel';

const setup = (open = true) => {
  const onClose = vi.fn();
  render(
    <>
      <button aria-expanded='true' data-detail-trigger='' type='button'>
        row
      </button>
      <p>outside</p>
      <DetailPanel label='Shopify' onClose={onClose} open={open}>
        <h2>Shopify</h2>
      </DetailPanel>
    </>,
  );
  return onClose;
};

describe('DetailPanel', () => {
  it('is a labelled dialog and hidden while closed', () => {
    setup(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.getElementById('detail')).toHaveAttribute('hidden');
  });

  it('moves focus to the panel when it opens', () => {
    setup(true);
    expect(screen.getByRole('dialog', { name: 'Shopify' })).toHaveFocus();
  });

  it('closes on Escape and hands focus back to the pressed row', async () => {
    const onClose = setup();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'row' })).toHaveFocus();
  });

  it('closes from the × button', () => {
    const onClose = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Close details' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes on a click outside but not on a row or inside the panel', () => {
    const onClose = setup();
    fireEvent.pointerDown(screen.getByRole('heading', { name: 'Shopify' }));
    fireEvent.pointerDown(screen.getByRole('button', { name: 'row' }));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.pointerDown(screen.getByText('outside'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('leaves Escape alone when another component already handled it', () => {
    const onClose = setup();
    const e = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    e.preventDefault();
    document.dispatchEvent(e);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('refocuses the card when another row swaps its content', () => {
    const { rerender } = render(
      <DetailPanel label='A' onClose={vi.fn()} open>
        <h2>A</h2>
      </DetailPanel>,
    );
    const card = screen.getByRole('dialog', { name: 'A' });
    card.blur();
    rerender(
      <DetailPanel label='B' onClose={vi.fn()} open>
        <h2>B</h2>
      </DetailPanel>,
    );
    expect(screen.getByRole('dialog', { name: 'B' })).toHaveFocus();
  });

  it('hands focus back to the row when closed with the × button', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Close details' }));
    expect(screen.getByRole('button', { name: 'row' })).toHaveFocus();
  });

  it('ignores Escape while closed', () => {
    const onClose = setup(false);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });
});
