// Storybook stand-in: the story picks the path with parameters.pathname (see .storybook/preview.tsx).
declare global {
  interface Window {
    __storyPathname?: string;
  }
}

export const usePathname = () => window.__storyPathname ?? '/';
export const useRouter = () => ({ push: () => {} });
