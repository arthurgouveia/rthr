import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import { setProjectAnnotations } from '@storybook/nextjs-vite';
import * as previewAnnotations from './preview';

// Apply the same global setup (theme, router stand-in, a11y gate) when stories run as Vitest tests.
setProjectAnnotations([a11yAddonAnnotations, previewAnnotations]);
