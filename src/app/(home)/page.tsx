import { pageById } from '@/lib/content';
import { pageMetadata } from '@/lib/page-metadata';
import { HomeView } from './home-view';

export const metadata = pageMetadata(pageById('index'));

export default function Page() {
  return <HomeView />;
}
