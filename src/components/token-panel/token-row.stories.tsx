import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { TOKENS } from '@/lib/tokens';
import { TokenRow } from './token-row';

const meta = {
  title: 'Components/TokenRow',
  component: TokenRow,
  args: { id: 'row', changed: false, onSet: fn(), def: TOKENS.colors[0] },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 400,
          padding: 'var(--space-md)',
          color: 'var(--fg)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TokenRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colour: Story = {};
export const ColourChanged: Story = { args: { changed: true } };
export const Slider: Story = { args: { def: TOKENS.spacing[2] } };
export const Duration: Story = { args: { def: TOKENS.motion[0] } };
