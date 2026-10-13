import { cssVars } from '@/lib/css-vars';
import typing from '@/styles/typing.module.css';

type Props = {
  text: string;
  // When to start, in typing ticks after page load (1 tick = --duration-type).
  at?: number;
  // How many ticks the cursor lingers after the last character.
  linger?: number;
};

// Text typed in by CSS, followed by a block cursor that goes away once it is done. The text is in
// the page from the start (the animation only reveals it), so screen readers and crawlers get it at once.
export function TypedText({ text, at = 0, linger = 0 }: Props) {
  const vars = cssVars({ '--n': text.length, '--at': at, '--linger': linger });
  return (
    <>
      <span className={typing.typed} style={vars}>
        {text}
      </span>
      <span aria-hidden='true' className={typing.cursor} style={vars} />
    </>
  );
}
