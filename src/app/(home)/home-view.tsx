import { PageFrame } from '@/components/page-frame/page-frame';
import { TypedText } from '@/components/terminal/typed-text';
import { content, pageById } from '@/lib/content';
import { cssVars } from '@/lib/css-vars';
import { statusTimeline } from '@/lib/typing';
import typing from '@/styles/typing.module.css';
import styles from './home-view.module.css';

// Ticks the cursor lingers after each status key before its value fades in.
const KEY_LINGER = 3;

export function HomeView() {
  const { command } = pageById('index');
  const { lines, end } = statusTimeline(command.length);
  return (
    <PageFrame className={styles.home} command={command}>
      <div className={styles.intro}>
        <h1 className={styles.name}>{content.site.name}</h1>
        <p className={styles.tagline}>{content.index.tagline}</p>
      </div>
      <div className={styles.status}>
        <dl>
          {lines.map((line) => (
            <div
              className={`${styles.line} ${typing.appear}`}
              key={line.key}
              style={cssVars({ '--at': line.at })}
            >
              <dt>
                <TypedText at={line.at} linger={KEY_LINGER} text={line.key} />
              </dt>
              <dd
                className={typing.fadeIn}
                style={cssVars({ '--at': line.at + line.key.length + KEY_LINGER })}
              >
                {line.value}
              </dd>
            </div>
          ))}
        </dl>
        <div className={styles.prompt}>
          <span className='accent'>$</span>{' '}
          <span
            aria-hidden='true'
            className={typing.cursorStays}
            style={cssVars({ '--at': end })}
          />
        </div>
      </div>
    </PageFrame>
  );
}
