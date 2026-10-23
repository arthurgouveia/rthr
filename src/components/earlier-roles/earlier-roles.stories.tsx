import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Timeline } from '@/components/timeline/timeline';
import { content } from '@/lib/content';
import { EarlierRoles } from './earlier-roles';

const { label, roles } = content.work.earlier;

const meta = {
  title: 'Components/EarlierRoles',
  component: EarlierRoles,
  args: { label, roles, now: '2026-10' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-xl)', color: 'var(--fg)' }}>
        <Timeline>
          <Story />
        </Timeline>
      </div>
    ),
  ],
} satisfies Meta<typeof EarlierRoles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TwoRoles: Story = { args: { roles: roles.slice(0, 2) } };
