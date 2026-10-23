import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Pill } from './pill';

const meta = {
  title: 'Components/Pill',
  component: Pill,
  args: { children: 'public' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-xl)', color: 'var(--fg)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Public: Story = {};
export const Fork: Story = { args: { children: 'fork' } };
