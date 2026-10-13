#!/usr/bin/env bash
# Cut a release: pick the next version from the conventional commits, bump package.json, regenerate
# CHANGELOG.md, commit, tag vX.Y.Z and push. The release workflow then publishes the GitHub Release.
#
#   npm run release            do it
#   npm run release:dry        only show the next version and what the changelog would say
set -euo pipefail

dry=false
[ "${1:-}" = "--dry-run" ] && dry=true

if [ "$(git branch --show-current)" != "main" ]; then
  echo "Releases are cut from main." >&2
  exit 1
fi
if [ -n "$(git status --porcelain)" ]; then
  echo "The working tree has uncommitted changes." >&2
  exit 1
fi

# First release: use the version already in package.json. After that: derive it from the commits.
if git describe --tags --abbrev=0 >/dev/null 2>&1; then
  next="$(npx --no-install git-cliff --bumped-version)"
else
  next="v$(node -p "require('./package.json').version")"
fi
echo "Next version: ${next}"

if [ "$dry" = true ]; then
  npx --no-install git-cliff --unreleased --tag "${next}"
  exit 0
fi

npm run ci
npm version "${next#v}" --no-git-tag-version --allow-same-version
npx --no-install git-cliff --tag "${next}" --output CHANGELOG.md
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore(release): ${next}"
git tag -a "${next}" -m "${next}"
git push origin main --follow-tags
echo "Pushed ${next}. The release workflow will publish the GitHub Release."
