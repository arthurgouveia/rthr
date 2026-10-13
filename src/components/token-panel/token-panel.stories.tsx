import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';
import { TokenPanel } from './token-panel';

const meta = {
  title: 'Components/TokenPanel',
  component: TokenPanel,
  args: { open: true, onClose: fn() },
  decorators: [
    (Story) => (
      <div className='app' style={{ height: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TokenPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = { args: { initialTab: 'colors' } };
export const Motion: Story = { args: { initialTab: 'motion' } };

export const ColorsLameFlame: Story = {
  args: { initialTab: 'colors' },
  globals: { theme: 'lame', accent: 'flame' },
};

export const EditAndReset: Story = {
  args: { initialTab: 'colors' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    fireEvent.change(canvas.getByLabelText('--soft hex'), { target: { value: '#123456' } });
    await expect(document.getElementById('token-overrides')?.textContent).toContain('#123456');
    await userEvent.click(canvas.getByRole('button', { name: 'reset' }));
    await expect(document.getElementById('token-overrides')?.textContent).toBe('');
  },
};
