import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactElement } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ErrorView } from '@/components/error-view/error-view';
import { Shell } from '@/components/shell/shell';
import { content } from '@/lib/content';
import { HomeView } from './(home)/home-view';
import { ContactView } from './contact/contact-view';
import { ProjectsView } from './projects/projects-view';
import { WorkView } from './work/work-view';

// Every page is rendered inside the real shell so the layout matches the site.
type PageProps = { view: () => ReactElement };
const Page = ({ view: View }: PageProps) => (
  <Shell>
    <View />
  </Shell>
);

const meta = { title: 'Pages', component: Page } satisfies Meta<typeof Page>;
export default meta;
type Story = StoryObj<typeof meta>;

const page = (pathname: string, view: PageProps['view']) => ({
  args: { view },
  parameters: { pathname },
});

const project = content.projects.find((p) => p.name.includes('-')) ?? content.projects[0];

export const Home: Story = page('/', HomeView);

// The same page in the other theme and another accent: the accessibility check runs in each.
export const HomeLameFlame: Story = {
  ...page('/', HomeView),
  globals: { theme: 'lame', accent: 'flame' },
};

export const Work: Story = page('/work', WorkView);

export const Projects: Story = page('/projects', ProjectsView);

export const ProjectDetailOpen: Story = {
  ...page('/projects', ProjectsView),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: new RegExp(project.name) }));
    const card = await canvas.findByRole('dialog', { name: project.name });
    await waitFor(() => expect(card).toBeVisible()); // it fades in
  },
};

export const Contact: Story = page('/contact', ContactView);

export const NotFound: Story = page('/crypt/secrets', () => <ErrorView code='404' />);

export const ServerError: Story = page('/work', () => <ErrorView code='500' />);
