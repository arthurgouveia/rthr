import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Job } from '@/lib/content';
import { JobEntry } from './job-entry';

const job: Job = {
  slug: 'acme',
  company: 'Acme',
  roles: [
    { title: 'Lead', start: '2020-03' },
    { title: 'Developer', start: '2018-01', end: '2020-03' },
  ],
  location: 'Lisbon, Portugal',
  type: 'Full-time · Remote',
  summary: 'Made the thing.',
  notes: ['Shipped it', 'Fixed it'],
  skills: ['React', 'Go'],
};

const renderEntry = (j: Job) =>
  render(
    <ol>
      <JobEntry job={j} now='2022-08' />
    </ol>,
  );

describe('JobEntry', () => {
  it('spans the first role to the last and says how long, relative to now', () => {
    renderEntry(job);
    expect(screen.getByText('Jan 2018 – Present')).toBeInTheDocument();
    expect(screen.getByText('Over four and a half years')).toBeInTheDocument();
    expect(screen.getByText('Lisbon, Portugal')).toBeInTheDocument();
    expect(screen.getByText('Full-time · Remote')).toBeInTheDocument();
  });

  it('dates each role when there are several', () => {
    renderEntry(job);
    expect(screen.getByText('Mar 2020 – Present · two and a half years')).toBeInTheDocument();
    expect(screen.getByText('Jan 2018 – Mar 2020 · over two years')).toBeInTheDocument();
  });

  it('leaves the date off a single role, and skips empty lists', () => {
    const { container } = renderEntry({ ...job, roles: [job.roles[1]], notes: [], skills: [] });
    expect(screen.queryByText(/Jan 2018 – Mar 2020 ·/)).not.toBeInTheDocument();
    expect(container.querySelector('ul')).toBeNull();
  });

  it('shows no length when only the year is known', () => {
    renderEntry({ ...job, roles: [{ title: 'Dev', start: '2013', end: '2013' }] });
    expect(screen.getByText('2013')).toBeInTheDocument();
  });
});
