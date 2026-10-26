import styles from './avatar.module.css';

type Props = { label: string };

// The lenses of the sunglasses. Like the glint, they are drawn in a smaller space (850 wide) that the
// group below scales up to the portrait's 1254.
const LENSES =
  'M470 229L494 233L515 247L529 270L529 291L519 308L501 317L482 316L462 307L447 287L441 264L446 243Z M602 278L622 277L643 286L657 304L664 325L656 345L638 357L619 359L602 343L595 322L594 300Z';

// The portrait. The SVG is black ink on a transparent background, so it is used as a mask: its shape
// comes from the file and its colour from the theme. A glint sweeps across the lenses now and then.
export function Avatar({ label }: Props) {
  return (
    <div aria-label={label} className={styles.avatar} role='img'>
      <svg aria-hidden='true' className={styles.glints} focusable='false' viewBox='0 0 1254 1254'>
        <clipPath id='avatar-lenses'>
          <path d={LENSES} />
        </clipPath>
        <g transform='scale(1.4752941176470589)'>
          <g clipPath='url(#avatar-lenses)'>
            <g className={styles.glint}>
              <path d='M350 215h9v12h4v13h4v12h4v15h4v13h4v12h4v14h4v13h4v14h4v14h4v15h-10v-15h-4v-14h-4v-14h-4v-13h-4v-14h-4v-12h-4v-13h-4v-15h-4v-12h-4v-13h-3Z' />
              <path d='M372 215h4l45 147h-4Z' />
              <path d='M387 215h6l45 147h-6Z' />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
