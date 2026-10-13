import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useRef } from 'react';
import { Bat } from './bat';

const Stage = () => {
  const area = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={area}
      style={{
        position: 'relative',
        height: 520,
        overflow: 'hidden',
        containerType: 'inline-size',
      }}
    >
      <Bat areaRef={area} />
      <p style={{ position: 'relative', textAlign: 'center', color: 'var(--muted)' }}>
        move the pointer over this area
      </p>
    </div>
  );
};

const meta = { title: 'Components/Bat', component: Stage } satisfies Meta<typeof Stage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChasesThePointer: Story = {};
