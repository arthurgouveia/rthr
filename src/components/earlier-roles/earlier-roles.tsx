import { TimelineEntry, TimelineMeta } from '@/components/timeline/timeline';
import { buildInfo } from '@/lib/build-info';
import type { EarlierRole } from '@/lib/content';
import { capitalise, describeMonths, formatRange, monthsBetween, numberWord } from '@/lib/dates';
import styles from './earlier-roles.module.css';

type Props = {
  // The group's name, such as "earlier/".
  label: string;
  roles: EarlierRole[];
  now?: string;
};

// The oldest jobs, folded into one timeline entry: the whole stretch on the left, one table row per
// role on the right (newest first, as they are listed).
export function EarlierRoles({ label, roles, now = buildInfo.month }: Props) {
  const start = roles.map((r) => r.start).reduce((a, b) => (a < b ? a : b));
  const end = roles.map((r) => r.end).reduce((a, b) => (a > b ? a : b));
  const months = monthsBetween(start, end, now);
  const stretch = months ? `${capitalise(describeMonths(months))}, ` : '';

  return (
    <TimelineEntry
      meta={
        <TimelineMeta
          label={`${stretch}${numberWord(roles.length)} roles`}
          range={formatRange(start, end)}
        />
      }
    >
      <section>
        <h2 className={styles.heading}>{label}</h2>
        <table className={styles.table}>
          <thead className='sr'>
            <tr>
              <th scope='col'>Period</th>
              <th scope='col'>Length</th>
              <th scope='col'>Role</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => {
              const roleMonths = monthsBetween(role.start, role.end, now);
              const rest = [role.summary, role.stack, role.location].filter(Boolean).join(' · ');
              return (
                <tr key={role.slug}>
                  <td className={styles.period}>{formatRange(role.start, role.end)}</td>
                  <td className={styles.length}>
                    {roleMonths ? capitalise(describeMonths(roleMonths)) : ''}
                  </td>
                  <td className={styles.what}>
                    <strong className={styles.who}>
                      {role.company} — {role.role}
                    </strong>
                    {rest && <span className={styles.rest}> · {rest}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </TimelineEntry>
  );
}
