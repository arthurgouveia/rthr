import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Command } from './command';

describe('Command', () => {
  it('puts the whole command in the page, so assistive tech and crawlers read it at once', () => {
    render(<Command text='whoami' />);
    expect(screen.getByText('whoami')).toBeInTheDocument();
  });
});
