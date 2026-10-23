import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SkillList } from './skill-list';

const meta = {
  title: 'Components/SkillList',
  component: SkillList,
  args: {
    skills: ['TypeScript', 'React', 'GraphQL', 'Apollo', 'Ruby on Rails', 'Webpack', 'Storybook'],
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '640px', padding: 'var(--space-xl)', color: 'var(--fg)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SkillList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Wrapping: Story = {
  args: {
    skills: [...Array(3)].flatMap((_, i) => ['React', 'TypeScript', 'Design Systems', `Tool ${i}`]),
  },
};
