#!/usr/bin/env bash
# Invoked by semantic-release (@semantic-release/exec prepareCmd) with the
# computed next version as $1. Keeps the Helm chart's `version` and
# `appVersion` equal to the app's own semver, since this chart is 1:1
# coupled to this one app — see docs/decisions/0005-commit-helm-values-defaults-to-git.md.
#
# Unlike the retired release-helm-chart.yml, the resulting change IS
# committed back to git — by @semantic-release/git, as part of the same
# release commit — so Chart.yaml never drifts from what's actually published.
set -euo pipefail

VERSION="$1"
CHART_FILE="helm/frontend-chart/Chart.yaml"

if [ -z "$VERSION" ]; then
  echo "Usage: $0 <version>" >&2
  exit 1
fi

sed -i.bak "s/^version:.*/version: ${VERSION}/" "$CHART_FILE"
sed -i.bak "s/^appVersion:.*/appVersion: \"${VERSION}\"/" "$CHART_FILE"
rm -f "${CHART_FILE}.bak"

# `sed -i` exits 0 even when its pattern matched zero lines (e.g. if
# Chart.yaml's `version:`/`appVersion:` keys ever get renamed, reordered, or
# reformatted) — silently leaving the chart on its old version while
# semantic-release still tags/publishes the new one everywhere else. Verify
# the substitution actually landed before declaring success.
if ! grep -qE "^version: ${VERSION}$" "$CHART_FILE"; then
  echo "ERROR: ${CHART_FILE} 'version' was not updated to ${VERSION} — check the sed pattern still matches the file." >&2
  exit 1
fi
if ! grep -qE "^appVersion: \"${VERSION}\"$" "$CHART_FILE"; then
  echo "ERROR: ${CHART_FILE} 'appVersion' was not updated to ${VERSION} — check the sed pattern still matches the file." >&2
  exit 1
fi

echo "Bumped ${CHART_FILE} to version/appVersion ${VERSION}"
