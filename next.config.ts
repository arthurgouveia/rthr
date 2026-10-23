import { execSync } from 'node:child_process';
import type { NextConfig } from 'next';
import pkg from './package.json';
import { legacyRedirects } from './src/lib/legacy-redirects';

// Vercel provides the branch at build time; locally ask git.
const branch = () => {
  if (process.env.VERCEL_GIT_COMMIT_REF) return process.env.VERCEL_GIT_COMMIT_REF;
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return 'main';
  }
};

const config: NextConfig = {
  reactStrictMode: true,
  // The old blog's URLs end in a slash. Without this, Next first strips the slash on the OLD host and
  // only then redirects here: two hops. With it, the rules in legacy-redirects.ts see the raw URL.
  skipTrailingSlashRedirect: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
    NEXT_PUBLIC_GIT_BRANCH: branch(),
    // The month of this build (YYYY-MM): what "now" means when the timeline counts a current job.
    // Fixed at build so the server and the browser always agree on the text.
    NEXT_PUBLIC_BUILD_MONTH: new Date().toISOString().slice(0, 7),
  },
  // The old arthurgouveia.com / .com.br sites redirect here (see src/lib/legacy-redirects.ts).
  async redirects() {
    return legacyRedirects();
  },
  // Basic hardening. (Vercel adds HSTS itself. A full Content-Security-Policy would need a hash
  // or nonce for the inline boot script, so only the directives that need neither are set.)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          // The parts of a Content-Security-Policy that need no hash for the inline boot script.
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'",
          },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default config;
