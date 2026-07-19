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

echo "Bumped ${CHART_FILE} to version/appVersion ${VERSION}"
