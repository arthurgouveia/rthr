import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { cssVars } from '@/lib/css-vars';
import { DetailPanel } from './detail-panel';
import styles from './detail-panel.module.css';

const meta = {
  title: 'Components/DetailPanel',
  component: DetailPanel,
  args: { open: true, label: 'Shopify', onClose: fn(), children: null },
  // The card is positioned against <main>, so give it a stand-in.
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'relative',
          height: 560,
          color: 'var(--fg)',
          fontFamily: 'var(--font-mono)',
          ...cssVars({ '--pad-x': 'var(--space-xl)' }),
        }}
      >
        <p>content behind the card</p>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <DetailPanel {...args}>
      <span className='muted'>$ cat shopify.log</span>
      <h2 className={styles.heading}>Shopify</h2>
      <dl className={styles.kv}>
        <dt className='muted'>role</dt>
        <dd>senior front end developer</dd>
        <dt className='muted'>period</dt>
        <dd>2015 — 2024</dd>
      </dl>
      <ul className={styles.bullets}>
        <li>
          <span>worked on critical public-facing areas like checkout</span>
        </li>
      </ul>
    </DetailPanel>
  ),
} satisfies Meta<typeof DetailPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
