import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Header } from './header';

const meta = {
  title: 'Shell/Header',
  component: Header,
  args: { file: 'index.md' },
  decorators: [
    (Story) => (
      <div className='app' style={{ height: 'auto' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SwitchesTheme: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /switch to/ }));
    await expect(canvas.getByRole('button', { name: /theme: lame/ })).toBeVisible();
    // put it back so other stories start dark
    await userEvent.click(canvas.getByRole('button', { name: /switch to/ }));
  },
};
