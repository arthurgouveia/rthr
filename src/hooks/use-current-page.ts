'use client';

import { useHydrated } from '@/hooks/use-hydrated';
import { usePathname } from '@/hooks/use-navigation';
import { lostPage, type Page, pageByPath } from '@/lib/content';

// The server renders unknown paths as /_not-found, so a "lost" page may only show the real path
// after hydration; before that it shows the root placeholder, which matches the server HTML.
export function useSettledPath() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  return hydrated ? pathname : '/';
}

// The page for the current URL: a known page, or the stand-in for an unknown path.
export function useCurrentPage(): Page {
  const pathname = usePathname();
  const settled = useSettledPath();
  return pageByPath(pathname) ?? lostPage(settled);
}
