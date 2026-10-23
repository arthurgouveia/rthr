import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Timeline, TimelineEntry, TimelineMeta } from './timeline';

const meta = {
  title: 'Components/Timeline',
  component: Timeline,
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-xl)', color: 'var(--fg)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <TimelineEntry
          current
          meta={
            <TimelineMeta
              details={['Austin, Texas, USA', 'Full-time · Remote']}
              label='A year and a half'
              range='May 2025 – Present'
            />
          }
        >
          <p>The current entry has a filled dot and an accent label.</p>
        </TimelineEntry>
        <TimelineEntry
          meta={
            <TimelineMeta
              details={['Montréal, Canada']}
              label='Nine years'
              range='Dec 2015 – Nov 2024'
            />
          }
        >
          <p>A finished entry has a hollow dot.</p>
        </TimelineEntry>
        <TimelineEntry meta={<TimelineMeta range='2013' />}>
          <p>An entry with no known length shows just its dates.</p>
        </TimelineEntry>
      </>
    ),
  },
};
