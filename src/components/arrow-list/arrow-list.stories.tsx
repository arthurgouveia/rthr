import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ArrowList } from './arrow-list';

const meta = {
  title: 'Components/ArrowList',
  component: ArrowList,
  args: {
    items: [
      'Managed a small team of front-end developers',
      'Crafted UIs alongside the UX team and helped evolve Polaris, Shopify’s open-source UI kit',
      'Interviewed many candidates and wrote the pair-programming challenges',
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '640px', padding: 'var(--space-xl)', color: 'var(--fg)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ArrowList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { items: [] } };
