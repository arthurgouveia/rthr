import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RippleBackground } from './ripple-background';

// The canvas fills whatever positioned box it is in.
const meta = {
  title: 'Components/RippleBackground',
  component: RippleBackground,
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: '420px', background: 'var(--bg)' }}>
        <Story />
        <p
          style={{
            position: 'relative',
            margin: 0,
            padding: 'var(--space-xl)',
            color: 'var(--fg)',
          }}
        >
          Content sits above the ripple.
        </p>
      </div>
    ),
  ],
} satisfies Meta<typeof RippleBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Saffron: Story = { globals: { accent: 'saffron' } };
export const Lame: Story = { globals: { theme: 'lame' } };
