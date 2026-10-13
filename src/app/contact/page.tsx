import { pageById } from '@/lib/content';
import { pageMetadata } from '@/lib/page-metadata';
import { ContactView } from './contact-view';

export const metadata = pageMetadata(pageById('contact'));

export default function Page() {
  return <ContactView />;
}
