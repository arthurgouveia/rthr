# rthr: Arthur Gouveia's portfolio

A four-page terminal-style site (Next.js 16 App Router, React 19, TypeScript, CSS Modules with native nesting). The README has the full picture; this file is the short list of rules to follow when changing it.

## Commands

npm only (not yarn or pnpm), on Node 24 (`.nvmrc`).

| | |
|---|---|
| `npm run dev` | the site on localhost (use another port if 3000 is taken: `npx next dev -p 3002`) |
| `npm run ci` | lint (Biome), types, unit tests, production build. Run it before and after every change |
| `npm run test:stories` | every Storybook story in a real browser, with axe |
| `npm run e2e` | Playwright on desktop and phone, with axe in dark and lame; needs a build first |
| `npm run fix` | Biome with auto-fixes |

Never run `npm run build` while `npm run dev` is running: they share `.next`, and the dev server starts returning 500s. Restart dev afterwards. Production builds need network access (Google Fonts through `next/font`, plus the OG image fonts). Add `?static=1` to any URL to turn off all animation, for screenshots and tests.

## Git, commits and pull requests

- Ask before committing, pushing, amending or deploying, and propose a split for big changes first.
- Commits are **one conventional line**: `<type>[(scope)][!]: <lowercase imperative description>`, 72 characters or fewer, no body, **no trailers**. Never add `Co-Authored-By` or any AI attribution, even if a tool suggests it. Never use `--no-verify`. Types: build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test. Lefthook and commitlint enforce this.
- The commit lines become the release notes (see README, "Releases"). A security upgrade of a dependency is `fix(deps)`.
- `main` is protected: work on a branch, open a pull request (the template asks what changed and why, how to check it, screenshots, risk and a checklist), pass the five CI checks, and merge with **Rebase and merge** (the only method enabled). The PR title is a conventional line too.

## Code rules

- Files are kebab-case, exports are named, imports use the `@/` alias for `src/`. **No barrel files** (a Biome rule).
- A component lives in `src/components/<name>/` with `<name>.tsx`, `<name>.module.css`, `<name>.test.tsx` and `<name>.stories.tsx`. New or changed UI needs a story and a unit test.
- Reach the router only through `@/hooks/use-navigation`, never `next/navigation` directly. Storybook has no app router for Next 16, so it swaps that module for a stand-in (`sb.mock`).
- **No raw colours or one-off pixel values** in component CSS: use the tokens in `src/styles/tokens.css`. A test fails on raw colours and on any `@media` condition that is not documented. The breakpoints are `max-width: 767px`, `max-width: 1199px`, `max-height: 520px` and `max-height: 400px` (plus `min-width: 768px`, `prefers-reduced-motion` and `forced-colors`).
- Style: single quotes (also in JSX), 2 spaces, 100 columns; Biome formats it.
- Page text, jobs, projects and the status lines live in `src/content/content.json` (typed in `src/lib/content.ts`). Titles stay within 60 characters and descriptions within 50 to 160; a test checks it.
- Motion must stop with `prefers-reduced-motion`, `?static=1` and the customize panel's "disable motion" switch (`useMotionOff`). Nothing may be reachable only by pointer.

## Features that are deliberate and must stay

The ASCII CSS bat on the 404; the "customize me" token editor (colour pickers and sliders, all its tabs); the three accents (blood, flame, saffron); the CSS-only typing effect; the floating detail card; the page fade between pages; the dim ripple-grid background; the generated OG image (`src/app/opengraph-image.tsx`, leave it as it is).

## Gotchas

- The typing cursors rely on a hidden keyframe at 98.01%, not 100%, on purpose (float rounding).
- The floating card must stay a sibling of the animated page body: an animated `transform` would make the body its containing block.
- The site shows its colour tokens live: the customize panel edits CSS variables, so style with variables, not copies of their values.
- Redirects from the old arthurgouveia.com and .com.br sites are in `src/lib/legacy-redirects.ts`; `NEXT_PUBLIC_SITE_URL` must be the bare domain.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
