<!--
  The PR title is one conventional line, like a commit: `<type>[(scope)]: <lowercase imperative>`,
  72 characters or fewer. Every commit in the PR is the same: one line, no body, no trailers.
  The story goes here, not in the commits.

  Types: feat, fix, perf, refactor, revert (these appear in the release notes) and
  docs, style, test, chore, ci, build (these do not). A security or bug fix in a dependency
  is `fix(deps)`, so it shows up in the release notes.
-->

## What changed and why

<!-- A few sentences: the problem or goal, what this does about it, anything surprising. -->

## How to check it

<!-- Where to look and what to do. Use the Vercel preview link from the checks below. -->

- [ ] Page or component:
- [ ] Steps:

## Screenshots

<!-- For anything visual: before and after, phone and desktop, dark and lame. Delete if nothing visual changed. -->

## Risk and rollback

<!-- What could break, and what to watch after it ships. "Revert this PR" is a fine rollback; say if it is not. -->

## Stack

<!-- Delete if this PR stands alone. -->

Depends on: #
Merge it after that PR; then run `git rebase origin/main` and `git push --force-with-lease`.

## Deployment notes

<!-- Delete if none: new or changed env vars (see .env.example), DNS, redirects, Vercel settings, new dependencies. -->

## Checklist

- [ ] `npm run ci` passes (lint, types, unit tests, build)
- [ ] `npm run test:stories` and `npm run e2e` pass (the e2e run includes axe, in dark and lame)
- [ ] New or changed UI has a story and a unit test
- [ ] Checked on phone and desktop widths (and 768–1199px if the layout changed), in dark and lame
- [ ] No raw colours or one-off pixel values: tokens from `src/styles/tokens.css`, and only the documented breakpoints
- [ ] Router only through `@/hooks/use-navigation`; named exports, no barrel files, kebab-case file names
- [ ] Motion stops with reduced motion, `?static=1` and the customize panel's switch; nothing is reachable only by pointer
- [ ] If page text changed: titles stay within 60 characters and descriptions within 50–160 (the search preview story and test check this)
- [ ] If a feature, flag, script or env var changed: the README says so
- [ ] Commits and the PR title are single-line conventional, with no trailers

<!-- Merge with "Rebase and merge" (the only method enabled): it keeps each commit as one line. -->
