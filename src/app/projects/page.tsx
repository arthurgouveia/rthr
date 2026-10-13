import { pageById } from '@/lib/content';
import { pageMetadata } from '@/lib/page-metadata';
import { ProjectsView } from './projects-view';

export const metadata = pageMetadata(pageById('projects'));

export default function Page() {
  return <ProjectsView />;
}
