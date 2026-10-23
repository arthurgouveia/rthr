import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Timeline } from '@/components/timeline/timeline';
import { content } from '@/lib/content';
import { JobEntry } from './job-entry';

const [current, several, single] = content.work.jobs;

// Entries hang off a timeline; two of them show the line running between dots.
const meta = {
  title: 'Components/JobEntry',
  component: JobEntry,
  args: { job: current, now: '2026-10' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-xl)', color: 'var(--fg)' }}>
        <Timeline>
          <Story />
        </Timeline>
      </div>
    ),
  ],
} satisfies Meta<typeof JobEntry>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Current: Story = {};
export const SeveralRoles: Story = { args: { job: several } };
export const SingleFinishedRole: Story = { args: { job: single } };
