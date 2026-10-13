import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ErrorView } from './error-view';

const meta = {
  title: 'Components/ErrorView',
  component: ErrorView,
  parameters: { pathname: '/crypt/secrets' },
  // The page body is normally centred inside <main>; give it a stage of the same shape.
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 600,
          padding: 'var(--space-xl)',
          color: 'var(--fg)',
          fontFamily: 'var(--font-mono)',
          containerType: 'inline-size',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ErrorView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotFound: Story = { args: { code: '404' } };
export const ServerError: Story = { args: { code: '500' } };
