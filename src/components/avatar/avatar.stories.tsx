import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar } from './avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  args: { label: 'Portrait of Arthur Gouveia' },
  decorators: [
    (Story) => (
      // The portrait has no width of its own; it fills its container, as in the sidebar.
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '10rem',
          margin: 'var(--space-xl)',
          color: 'var(--fg)',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = {};
export const Lame: Story = { globals: { theme: 'lame' } };
export const Saffron: Story = { globals: { accent: 'saffron' } };
