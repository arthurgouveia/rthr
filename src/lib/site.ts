// Canonical origin. Override with NEXT_PUBLIC_SITE_URL when the domain changes.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : '') ||
  'https://rthr.dev'
).replace(/\/+$/, '');

// Preview and development deploys must not be indexed. Locally (no VERCEL_ENV) behave like production.
export const IS_PRODUCTION = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === 'production'
  : true;

// Google Analytics 4 measurement ID. Empty means no Google Analytics.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';
