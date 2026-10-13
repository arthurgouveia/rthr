'use client';

import { type MouseEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from '@/hooks/use-navigation';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { cssMs, isStatic } from '@/lib/motion';

// If the route has not changed this long after pushing, the navigation failed: show the page again.
const FAILSAFE_MS = 2000;

// Page-to-page navigation with a fade-out first. `go` is the click handler for links; `leaving`
// is true while the page is fading. A route change (pathname) ends the fade; Back/forward cancels it.
export function useFadeNavigation(pathname: string) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<number>(undefined);

  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once per route change
  useEffect(() => {
    clearTimeout(timer.current);
    setLeaving(false);
  }, [pathname]);

  useEffect(() => {
    const cancel = () => {
      clearTimeout(timer.current);
      setLeaving(false);
    };
    window.addEventListener('popstate', cancel);
    return () => {
      window.removeEventListener('popstate', cancel);
      clearTimeout(timer.current);
    };
  }, []);

  // A plain click fades out over --duration-fast, then navigates. Modified clicks (new tab, etc.)
  // and clicks on the current page are left to the browser or ignored.
  const go = (e: MouseEvent<HTMLAnchorElement>, path: string) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (path === pathname) return;
    const out = cssMs('--duration-fast');
    if (reduced || isStatic() || out <= 0) {
      router.push(path);
      return;
    }
    setLeaving(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      router.push(path);
      timer.current = window.setTimeout(() => setLeaving(false), FAILSAFE_MS);
    }, out);
  };

  return { leaving, go };
}
