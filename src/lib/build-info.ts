// All of these are baked in at build time by next.config.ts.
export const buildInfo = {
  version: process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0',
  branch: process.env.NEXT_PUBLIC_GIT_BRANCH ?? 'main',
  month: process.env.NEXT_PUBLIC_BUILD_MONTH ?? new Date().toISOString().slice(0, 7),
};
