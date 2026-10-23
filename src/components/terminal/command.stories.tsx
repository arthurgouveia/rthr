import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Command } from './command';

const meta = {
  title: 'Terminal/Command',
  component: Command,
  decorators: [
    (Story) => (
      <div style={{ padding: 24, color: 'var(--fg)', fontFamily: 'var(--font-mono)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { text: 'ls -l projects/ --sort=relevance' } };

// The only story that plays the real typing animation (the rest show the finished state).
export const Typing: Story = {
  args: { text: 'ls -l projects/ --sort=relevance' },
  parameters: { animated: true },
};
