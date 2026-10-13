import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { CopyButton } from './copy-button';

const meta = {
  title: 'Components/CopyButton',
  component: CopyButton,
  args: { text: 'hey@arthur.lol' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-xl)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Copied: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /copy hey@arthur.lol/ }));
    // Clipboard access can be denied inside the Storybook frame; either outcome is announced.
    // (the visible label and the screen-reader announcement both match)
    await expect(await canvas.findAllByText(/copied|failed/)).not.toHaveLength(0);
  },
};
