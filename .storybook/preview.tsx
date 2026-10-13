import type { Decorator, Preview } from '@storybook/nextjs-vite';
import { sb } from 'storybook/test';
import '../src/styles/tokens.css';
import '../src/styles/base.css';

// Same two attributes the app sets on <html>, driven from the Storybook toolbar.
const withTheme: Decorator = (Story, context) => {
  const root = document.documentElement;
  window.__storyPathname = context.parameters.pathname;
  // Finished state, like ?static=1 on the site: no typing or fades. Stories that are about the
  // animation opt out with parameters.animated.
  root.classList.toggle('static', !context.parameters.animated);
  root.classList.add('js');
  root.dataset.theme = context.globals.theme;
  root.dataset.accent = context.globals.accent;
  return <Story />;
};

declare global {
  interface Window {
    __storyPathname?: string;
  }
}

// Swap the router hooks for stand-ins that read the story's parameters.pathname.
// (Components must reach the router through src/hooks/use-navigation.ts, not next/navigation directly:
// Storybook has no app router for Next 16, so a direct import would fail here.)
sb.mock(import('../src/hooks/use-navigation.ts'));

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: { title: 'Theme', icon: 'mirror', items: ['dark', 'lame'], dynamicTitle: true },
    },
    accent: {
      description: 'Accent colour',
      toolbar: {
        title: 'Accent',
        icon: 'paintbrush',
        items: ['blood', 'flame', 'saffron'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'dark', accent: 'blood' },
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true },
    a11y: { test: 'error' },
  },
};

export default preview;
