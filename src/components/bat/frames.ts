// Wings up, level, down. The flap cycle (up, level, down, level) is in bat.module.css.
export const BAT_FRAMES = [
  {
    pose: 'up',
    art: '  /\\               /\\  \n /  \\    /\\_/\\    /  \\ \n/    \\__( o o )__/    \\\n\\_  __   \\ v /   __  _/\n  \\/  \\___\\_/___/  \\/  ',
  },
  {
    pose: 'level',
    art: '                       \n  _____  /\\_/\\  _____  \n /     \\( o o )/     \\ \n \\_/\\_/\\_\\ v /_/\\_/\\_/ \n          \\_/          ',
  },
  {
    pose: 'down',
    art: '                       \n         /\\_/\\         \n   _____( o o )_____   \n  /  /  /\\ v /\\  \\  \\  \n /__/__/  \\_/  \\__\\__\\ ',
  },
] as const;
