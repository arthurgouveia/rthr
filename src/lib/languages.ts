// Language ids (as written in content.json) and how they are shown.
const LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  css: 'CSS',
  html: 'HTML',
  shell: 'Shell',
  apacheconf: 'ApacheConf',
};

export const languageLabel = (lang: string) => LABELS[lang] ?? lang;
