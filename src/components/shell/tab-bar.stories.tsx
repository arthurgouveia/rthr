import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { TabBar } from './tab-bar';

const meta = {
  title: 'Shell/TabBar',
  component: TabBar,
  args: { currentId: 'projects', onNavigate: fn((e) => e.preventDefault()) },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProjectsCurrent: Story = {};
