import styles from './command.module.css';
import { TypedText } from './typed-text';

type Props = {
  text: string;
};

// The shell command at the top of every page.
export function Command({ text }: Props) {
  return (
    <p className={styles.cmd}>
      <span className='accent'>$</span> <TypedText text={text} />
    </p>
  );
}
