'use client';

import { usePathname as useNextPathname, useRouter as useNextRouter } from 'next/navigation';

// Thin wrappers so Storybook can swap the router out (it has no Next 16 app router to mount).
export const usePathname = () => useNextPathname();
export const useRouter = () => useNextRouter();
