import { pageById } from '@/lib/content';
import { pageMetadata } from '@/lib/page-metadata';
import { WorkView } from './work-view';

export const metadata = pageMetadata(pageById('work'));

export default function Page() {
  return <WorkView />;
}
