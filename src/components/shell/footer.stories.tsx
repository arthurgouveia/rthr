import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { cssVars } from '@/lib/css-vars';
import { Footer } from './footer';

const meta = {
  title: 'Shell/Footer',
  component: Footer,
  args: { status: 'PRESENTING', panelOpen: false, onTogglePanel: fn(), tokensButtonRef: null },
  decorators: [
    (Story) => (
      <div style={cssVars({ '--inset': 'calc(var(--space-md) + var(--space-lg))' })}>
        <Story />
        {/* the footer button points at the customize panel, which the shell renders */}
        <div id='tokens' />
      </div>
    ),
  ],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const PanelOpen: Story = { args: { panelOpen: true } };
