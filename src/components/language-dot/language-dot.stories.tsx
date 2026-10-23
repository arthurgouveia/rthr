import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LanguageDot } from './language-dot';

const meta = {
  title: 'Components/LanguageDot',
  component: LanguageDot,
  args: { lang: 'typescript' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-xl)', color: 'var(--fg)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LanguageDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeScript: Story = {};
export const JavaScript: Story = { args: { lang: 'javascript' } };
export const Css: Story = { args: { lang: 'css' } };
export const Shell: Story = { args: { lang: 'shell' } };
// A language with no colour of its own falls back to the muted dot, and its id as the label.
export const Unknown: Story = { args: { lang: 'brainfuck' } };
