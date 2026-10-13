import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Sidebar } from './sidebar';

const meta = {
  title: 'Shell/Sidebar',
  component: Sidebar,
  args: { currentId: 'work', onNavigate: fn((e) => e.preventDefault()) },
  decorators: [
    (Story) => (
      <div className='app' style={{ height: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WorkCurrent: Story = {};
