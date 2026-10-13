import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { content } from '@/lib/content';
import { serpResults } from '@/lib/serp';
import { SerpPreviewList } from './serp-preview';

const meta = {
  title: 'SEO/Search results',
  component: SerpPreviewList,
  args: { results: serpResults() },
} satisfies Meta<typeof SerpPreviewList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Every page, as Google will probably show it. Edit titles and descriptions in content.json.
export const AllPages: Story = {};

// What a result with problems looks like: a long title, a short description, a shared one.
export const WithProblems: Story = {
  args: {
    results: serpResults([
      {
        ...content.pages[1],
        title: 'A very long page title that keeps going well past what a result can show',
        description: 'Too short.',
      },
      { ...content.pages[2], title: 'Same title', description: content.pages[3].description },
      { ...content.pages[3], title: 'Same title' },
    ]),
  },
};
