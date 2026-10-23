import { Fragment } from 'react';
import { PageFrame } from '@/components/page-frame/page-frame';
import { Pill } from '@/components/pill/pill';
import { TypedText } from '@/components/terminal/typed-text';
import { content, pageById, type StatusSuffix as StatusSuffixValue } from '@/lib/content';
import { cssVars } from '@/lib/css-vars';
import { statusTimeline } from '@/lib/typing';
import { statusSuffix } from '@/lib/work';
import typing from '@/styles/typing.module.css';
import styles from './home-view.module.css';

// Ticks the cursor lingers after each status key before its value fades in.
const KEY_LINGER = 3;

// The pill after a status value. Read out as "Shopify for about nine years", not "Shopify ~9 yrs".
function StatusSuffix({ suffix }: { suffix: StatusSuffixValue | undefined }) {
  const shown = statusSuffix(suffix);
  if (!shown) return null;
  return (
    <>
      {' '}
      <span className={styles.suffix}>
        <Pill filled>
          <span className='sr'>for {shown.spoken}</span>
          <span aria-hidden='true'>{shown.label}</span>
        </Pill>
      </span>
    </>
  );
}

export function HomeView() {
  const { command } = pageById('index');
  const { lines, end } = statusTimeline(command.length);
  return (
    <PageFrame className={styles.home} command={command}>
      <div className={styles.intro}>
        <h1 className={styles.name}>{content.site.name}</h1>
        <p className={styles.tagline}>
          {content.index.tagline.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </p>
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
                <StatusSuffix suffix={line.suffix} />
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
