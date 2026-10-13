'use client';

import { ErrorView } from '@/components/error-view/error-view';

// Shown inside the shell when a page throws while rendering.
export default function ErrorPage() {
  return <ErrorView code='500' />;
}
