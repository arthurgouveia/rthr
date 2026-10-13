import raw from '@/content/content.json';

export type PageId = 'index' | 'work' | 'projects' | 'contact';

export type Page = {
  id: PageId | '404';
  num: string;
  file: string;
  tab: string;
  command: string;
  status: string;
  path: string;
  // <title> (without the site name) and meta description
  title: string;
  description: string;
};

type Job = {
  slug: string;
  company: string;
  role: string;
  period: string;
  status: 'in-progress' | 'done';
  stack: string;
  notes: string[];
};

type Project = {
  name: string;
  lang: string;
  stars: number;
  forks: number | null;
  desc: string;
  href: string;
};

type ContactRow = {
  label: string;
  text: string;
  href: string;
  copy?: boolean;
};

type Content = {
  site: {
    name: string;
    user: string;
    home: string;
    role: string;
    location: string;
    established: string;
    links: { github: string; linkedin: string; repo: string };
  };
  pages: Page[];
  index: { tagline: string; status: { key: string; value: string }[] };
  work: {
    jobs: Job[];
  };
  projects: Project[];
  contact: { heading: string; rows: ContactRow[]; footnote: string };
};

export const content: Content = raw as Content;

export const pageById = (id: PageId): Page => {
  const page = content.pages.find((p) => p.id === id);
  if (!page) throw new Error(`unknown page: ${id}`);
  return page;
};

const trimSlash = (path: string) => path.replace(/\/+$/, '');

// Stand-in page for unknown paths: the shell shows the bad path and no nav item is current.
export const lostPage = (path: string): Page => {
  const clean = trimSlash(path);
  const lost = clean && clean !== '/' ? clean : '/dark-matter';
  const command = `cd ${lost}`;
  return {
    id: '404',
    num: '??',
    file: lost.slice(1),
    tab: '',
    command,
    status: 'LOST',
    path: lost,
    title: 'Page not found',
    description: '',
  };
};

export const pageByPath = (path: string): Page | undefined => {
  const clean = trimSlash(path) || '/';
  return content.pages.find((p) => p.path === clean);
};
