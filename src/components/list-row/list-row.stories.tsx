import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { ListRow } from './list-row';

const meta = {
  title: 'Components/ListRow',
  component: ListRow,
  args: {
    expanded: false,
    onSelect: fn(),
    className: '',
    leadClassName: '',
    lead: '2015 — 2024',
    children: <span>Shopify</span>,
  },
  // Rows live in a list that leaves room on the left for the › that appears on hover.
  decorators: [
    (Story) => (
      <div
        style={{ padding: 'var(--space-xl)', color: 'var(--fg)', fontFamily: 'var(--font-mono)' }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Expanded: Story = { args: { expanded: true } };
