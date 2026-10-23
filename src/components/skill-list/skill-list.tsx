import styles from './skill-list.module.css';

// A dot in the accent colour, then the skills in one muted line, separated by ·.
export function SkillList({ skills }: { skills: string[] }) {
  if (skills.length === 0) return null;
  return (
    <ul aria-label='Skills' className={styles.list}>
      {skills.map((skill) => (
        <li key={skill}>{skill}</li>
      ))}
    </ul>
  );
}
