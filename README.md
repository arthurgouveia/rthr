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

A four-page terminal-style portfolio (`index.md`, `work.log`, `projects/`, `summon.sh`), dark by default, with a live token editor, three accent colours (blood, flame, saffron), CSS-only typing, an ASCII bat on the 404 and a floating detail card. Every page fits one screen.

## Quick start

```bash
npm install          # also installs the git hooks
npm run dev          # http://localhost:3000
```

Needs Node 24 (see `.nvmrc`; 20.9 or newer works). Preview flags for screenshots: `?static=1` (no animation), `?theme=lame`, `?accent=flame`, `?tokens=1&tab=spacing`.

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
- **Design system:** `src/styles/tokens.css` holds the tokens as CSS variables (colours per theme, three accents, spacing, type, motion); `base.css` is the reset and helpers; every component has a `*.module.css` next to it. A test fails on raw colours or undocumented breakpoints.
- **Theme:** `data-theme` (dark or lame) and `data-accent` on `<html>`, set before first paint by `src/lib/boot-script.ts`.
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

## Pull requests

Work happens on a branch (`feat/…`, `fix/…`, `chore/…`) and reaches `main` through a pull request. The PR title is a conventional commit line too, and the template (`.github/pull_request_template.md`) asks for what changed and why, how to check it, screenshots, risk and a checklist. `main` is protected:

- the five CI checks must pass (lint and unit tests, build, Storybook, end-to-end and accessibility, Lighthouse), on a branch that is up to date with `main`;
- history stays linear and conversations must be resolved; no force pushes or deletions;
- the only merge method is **Rebase and merge**, so every commit stays one conventional line and the changelog stays clean; merged branches are deleted automatically.

Admins can bypass the rules so that `npm run release`, which pushes the release commit and tag to `main`, keeps working.

## Releases

Versions follow [semver](https://semver.org/) and are worked out from the commits since the last tag (git-cliff, configured in `cliff.toml`). Each commit line becomes one bullet in `CHANGELOG.md` and in the GitHub Release, so the commit lines *are* the release notes.

| Commit | Where it shows up | Version |
|---|---|---|
| `feat` | Features | minor |
| `fix` | Bug fixes | patch |
| `fix(deps)` | Security and dependencies | patch |
| `perf`, `refactor`, `revert` | Performance, Refactoring, Reverts | patch |
| any type with `!` (`feat!:`, `fix(panel)!:`) | Breaking changes, at the top | major |
| `docs`, `style`, `test`, `chore`, `ci`, `build` | not listed | none |

**Writing a commit that reads well in the notes:** say what a visitor or developer gets, not how (`feat: show job durations as pills`, not `feat: add statusSuffix helper`); keep it to one line, imperative and lowercase (the template capitalises it); add a scope for the area (`fix(footer): …`). Upgrade a vulnerable dependency as `fix(deps)` so it appears in the notes; routine bumps (Dependabot's `chore(deps)`) stay out. Breaking changes are marked with the `!` only, because commits have no footer.

**Cutting a release** (from `main`, once the merged work has gone green in CI):

```bash
npm run release:dry   # the next version and the notes it would publish
npm run release       # do it
npm run release -- v1.2.0   # force a version, rarely needed
```

The script refuses to run unless you are on `main`, the tree is clean, `main` matches `origin/main`, CI is green on that exact commit, the version is new, and there is something to release (a `feat`, `fix`, `perf`, `refactor` or `revert` since the last tag). It then runs `npm run ci`, bumps `package.json`, regenerates `CHANGELOG.md`, commits `chore(release): vX.Y.Z`, creates the annotated tag `vX.Y.Z` and pushes both. The push goes straight to `main`, which admins can do despite the branch protection.

The release workflow then checks that the tag matches `package.json` and sits on `main`, and publishes the GitHub Release with that version's entry and a link to the full comparison. The footer shows the build's branch and version, linking to that release.

- `CHANGELOG.md` is generated: never edit it by hand. To change its wording, change the commit lines before releasing, or the template in `cliff.toml`.
- A published tag is never moved or deleted. If a release is wrong, fix it in a pull request and release the next patch.
- A hotfix is a normal `fix` pull request, then `npm run release`.

## Deploying

Two Vercel projects from this repo: the site, and Storybook (Framework Preset `Other`, Build Command `npm run build-storybook`, Output Directory `storybook-static`). Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) once the domain is final, and `NEXT_PUBLIC_GA_ID` for Google Analytics (production only; leave it empty to switch it off). Preview deploys are `noindex`.
