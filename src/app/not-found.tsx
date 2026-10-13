import type { Metadata } from 'next';
import { ErrorView } from '@/components/error-view/error-view';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return <ErrorView code='404' />;
}
