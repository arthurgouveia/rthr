import { vi } from 'vitest';

// Stand-in for the router, shared by every test (wired up in vitest.setup.ts):
// set `navigation.pathname` to choose the current URL, read `navigation.push` to see navigations.
export const navigation = {
  pathname: '/',
  push: vi.fn(),
};
