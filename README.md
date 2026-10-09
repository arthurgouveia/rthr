# rthr

My goth-like terminal cv kind of thing. 🦇

![Next.js](https://img.shields.io/badge/Next.js-000?style=flat-square&logo=nextdotjs)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel)
![Biome](https://img.shields.io/badge/Biome-60A5FA?style=flat-square&logo=biome&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=flat-square&logo=storybook&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)

A four-page terminal-style portfolio (`index.md`, `work.log`, `projects/`, `summon.sh`), dark by default, with a live token editor, four accent reds, CSS-only typing, an ASCII bat on the 404 and a floating detail card. Every page fits one screen.

## Quick start

```bash
npm install          # also installs the git hooks
npm run dev          # http://localhost:3000
```

Needs Node 24 (see `.nvmrc`; 20.9 or newer works). Preview flags for screenshots: `?static=1` (no animation), `?theme=lame`, `?red=ember`, `?tokens=1&tab=spacing`.

| Script | What it does |
|---|---|
| `npm run ci` | lint, types, unit tests, build (the pre-push gate) |
| `npm test` / `test:watch` / `test:coverage` | unit and component tests (Vitest, jsdom) |
| `npm run test:stories` | every story in a real browser: renders, plays, passes axe |
| `npm run e2e` | Playwright smoke and accessibility tests against the production build |
| `npm run storybook` / `build-storybook` | component workshop on port 6006 / static build |
| `npm run check` / `fix` / `typecheck` | Biome lint and format, TypeScript |
| `npm run analyze` | bundle analyzer |
| `npm run release` / `release:dry` | cut a version from the commit history (see Releases) |

## How it is built

- **Content:** all copy lives in `src/content/content.json`.
- **Design system:** `src/styles/tokens.css` holds the tokens as CSS variables (colours per theme, four reds, spacing, type, motion); `base.css` is the reset and helpers; every component has a `*.module.css` next to it. A test fails on raw colours or undocumented breakpoints.
- **Theme:** `data-theme` (dark or lame) and `data-red` on `<html>`, set before first paint by `src/lib/boot-script.ts`.
- **Typing effect:** pure CSS (`src/styles/typing.module.css`), so the text is in the page from the start.
- **Fonts:** Pirata One and JetBrains Mono through `next/font/google`, self-hosted at build.
- **Structure:** App Router, no barrel files, kebab-case files, named exports, `@/` alias for `src/`.

```
src/app/         routes, metadata, 404/500 pages
src/components/  shell, page-frame, list-page, list-row, detail-panel, token-panel, terminal, bat, error-view
src/hooks/       small React hooks
src/lib/         content, theme, tokens, helpers
src/styles/      tokens, base and shared CSS modules
e2e/             Playwright tests
```

## Quality gates

Lefthook runs Biome on staged files before a commit, commitlint on the message and `npm run ci` before a push. GitHub Actions repeats those checks and adds the Storybook run, Playwright (with axe, dark and lame, desktop and phone) and Lighthouse.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/), enforced by commitlint, the same rules as stargate-ui: `<type>[(scope)][!]: <description>`, lowercase, imperative, 72 characters or fewer, **a single line with no body and no trailers** (no `Co-Authored-By`).

```
feat: add 500 page
fix(footer): keep est. on one line
```

## Releases

`npm run release` picks the next semver from the commits (git-cliff), bumps `package.json`, regenerates `CHANGELOG.md`, commits `chore(release): vX.Y.Z`, tags it and pushes; the release workflow then publishes the GitHub Release. The footer shows the build's branch and version, linking to that release.

## Deploying

Two Vercel projects from this repo: the site, and Storybook (Framework Preset `Other`, Build Command `npm run build-storybook`, Output Directory `storybook-static`). Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) once the domain is final. Preview deploys are `noindex`.
