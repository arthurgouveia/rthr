import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { ProjectCard } from './project-card';

const meta = {
  title: 'Components/ProjectCard',
  component: ProjectCard,
  args: {
    name: 'prettyCheckable',
    desc: 'A jQuery plugin that replaces native checkboxes and radios with custom images.',
    lang: 'javascript',
    stars: 341,
    forks: 92,
    expanded: false,
    onSelect: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'var(--card-min)', padding: 'var(--space-xl)', color: 'var(--fg)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Expanded: Story = { args: { expanded: true } };
export const Fork: Story = {
  args: {
    name: 'installme-osx',
    desc: 'My personal script to set up a new OS X machine.',
    lang: 'shell',
    stars: 2,
    forks: 1,
    forkedFrom: 'ruyadorno/installme-osx',
  },
};
export const LongDescription: Story = {
  args: {
    name: 'bebop',
    lang: 'css',
    stars: 24,
    forks: 3,
    desc: 'An HTML5 and CSS3 boilerplate built on H5BP with Compass and Grunt, to kickstart and optimize the dev flow of simple sites and apps.',
  },
};
