import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { content } from '@/lib/content';
import { mockClipboard } from '@/test/clipboard';
import { ContactView } from './contact-view';
import { CopyButton } from './copy-button';

describe('ContactView', () => {
  it('links every row, with the mail row as mailto: and the only one with a copy button', () => {
    render(<ContactView />);
    const mail = content.contact.rows[0];
    expect(screen.getByRole('link', { name: mail.text })).toHaveAttribute('href', mail.href);
    expect(mail.href).toMatch(/^mailto:/);
    expect(screen.getAllByRole('link')).toHaveLength(content.contact.rows.length);
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('button', { name: `copy ${mail.text}` })).toBeInTheDocument();
  });
});

describe('CopyButton', () => {
  it('copies the text and confirms it, visibly and for screen readers', async () => {
    const writeText = mockClipboard();
    render(<CopyButton text='hey@arthur.lol' />);
    await userEvent.click(screen.getByRole('button', { name: 'copy hey@arthur.lol' }));
    expect(writeText).toHaveBeenCalledWith('hey@arthur.lol');
    expect(await screen.findByText('copied ✓')).toBeInTheDocument();
    expect(screen.getByText('hey@arthur.lol copied')).toBeInTheDocument();
  });

  it('says so when the copy fails instead of pretending it worked', async () => {
    mockClipboard(vi.fn().mockRejectedValue(new Error('denied')));
    render(<CopyButton text='hey@arthur.lol' />);
    await userEvent.click(screen.getByRole('button', { name: 'copy hey@arthur.lol' }));
    expect(await screen.findByText('failed')).toBeInTheDocument();
    expect(screen.queryByText('copied ✓')).not.toBeInTheDocument();
  });
});
