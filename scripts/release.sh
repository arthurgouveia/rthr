#!/usr/bin/env bash
# Cut a release: work out the next version from the conventional commits, regenerate CHANGELOG.md,
# commit `chore(release): vX.Y.Z`, tag it and push. The release workflow then publishes the GitHub
# Release from the same changelog entry.
#
#   npm run release                 do it
#   npm run release:dry             show the next version and the notes it would publish
#   npm run release -- v1.2.0       use this version instead of the one the commits give
#
# It refuses to run unless main is clean, in step with origin and green in CI, and unless there is
# something to release (a feat, fix, perf, refactor or revert since the last tag).
set -euo pipefail

die() { echo "release: $*" >&2; exit 1; }

dry=false
explicit=""
for arg in "$@"; do
  case "$arg" in
    --dry-run) dry=true ;;
    v[0-9]*.[0-9]*.[0-9]*) explicit="$arg" ;;
    [0-9]*.[0-9]*.[0-9]*) explicit="v$arg" ;;
    *) die "unknown argument: $arg (use --dry-run, or a version such as v1.2.0)" ;;
  esac
done

cliff() { npx --no-install git-cliff "$@" 2>/dev/null; }

# ---- where we are
[ "$(git branch --show-current)" = "main" ] || die "releases are cut from main."
[ -z "$(git status --porcelain)" ] || die "the working tree has uncommitted changes."
git fetch --quiet origin main --tags
read -r behind ahead < <(git rev-list --left-right --count origin/main...HEAD)
[ "$behind" = 0 ] || die "main is $behind commit(s) behind origin/main; pull first."
[ "$ahead" = 0 ] || die "main has $ahead commit(s) that are not on origin/main; they must go through a pull request first."

# ---- CI must be green on this exact commit (set SKIP_CI_CHECK=1 to skip, e.g. without the gh CLI)
if [ "$dry" = false ] && [ -z "${SKIP_CI_CHECK:-}" ]; then
  command -v gh >/dev/null || die "the gh CLI is needed to check CI (or set SKIP_CI_CHECK=1)."
  ci="$(gh run list --workflow CI --commit "$(git rev-parse HEAD)" --limit 1 --json status,conclusion \
    --jq '.[0] | "\(.status)/\(.conclusion)"' 2>/dev/null || true)"
  [ "$ci" = "completed/success" ] || die "CI is not green on this commit (got: ${ci:-no run found}). Wait for it, or fix it."
fi

# ---- the version
last="$(git describe --tags --abbrev=0 --match 'v[0-9]*' 2>/dev/null || true)"
if [ -n "$explicit" ]; then
  next="$explicit"
elif [ -z "$last" ]; then
  # first release: the version already in package.json
  next="v$(node -p "require('./package.json').version")"
else
  next="$(cliff --bumped-version)"
  [ "$next" != "$last" ] || die "nothing to release since $last: only docs, style, test, chore, ci or build commits."
fi
[[ "$next" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]] || die "'$next' is not a version like v1.2.3."
! git rev-parse -q --verify "refs/tags/$next" >/dev/null || die "the tag $next already exists."

echo "Releasing ${next} (last release: ${last:-none})"
echo
if [ -n "$last" ]; then cliff --unreleased --tag "$next" --strip all; else cliff --tag "$next" --strip all; fi
echo

if [ "$dry" = true ]; then
  echo "Dry run: nothing was changed."
  exit 0
fi

# ---- do it
npm run ci
npm version "${next#v}" --no-git-tag-version --allow-same-version
cliff --tag "$next" --output CHANGELOG.md
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore(release): ${next}"
git tag -a "${next}" -m "${next}"
git push origin main --follow-tags
echo "Pushed ${next}. The release workflow will publish the GitHub Release."
