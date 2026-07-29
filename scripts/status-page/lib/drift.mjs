// Decides whether what staging is actually running matches what was actually
// released. Kept as a pure function with no I/O so it can be unit-tested
// directly (drift.test.mjs) -- it's the only real logic in the status page
// generator, and the one part where being quietly wrong would be worse than
// showing nothing at all.
//
// Inputs come from three files written by .github/workflows/status-page.yml:
//   running  <- .status-data/staging-version.json  ({httpCode, payload, fetchedAt})
//   releases <- .status-data/releases.json         ({stable, prerelease, stableList})
//   staging  <- .status-data/staging-health.json   ({ok, httpCode, latencyMs, checkedAt})
// Any of them may be null (local runs with no artifacts, or a failed step).

/**
 * Strips a single leading `v`. Git tags are the only artifact carrying the
 * prefix -- package.json, Chart.yaml, Docker tags and APP_VERSION are all bare
 * semver. See docs/versioning.md.
 */
export function normalizeVersion(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.replace(/^v/, '');
}

function pluralize(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

/**
 * @returns {{
 *   state: 'unreachable'|'unknown'|'no-release'|'in-sync'|'behind'|'diverged',
 *   severity: 'pass'|'warn'|'fail'|'neutral',
 *   label: string,
 *   detail: string|null,
 *   runningVersion: string|null,
 *   runningCommit: string|null,
 *   runningShortCommit: string|null,
 *   imageTag: string|null,
 *   builtAt: string|null,
 *   startedAt: string|null,
 *   uptimeSeconds: number|null,
 *   fetchedAt: string|null,
 *   releasedVersion: string|null,
 *   releasedPublishedAt: string|null,
 *   releasedUrl: string|null,
 *   releasesBehind: number|null,
 * }}
 */
export function computeDrift({ running, releases, staging } = {}) {
  const payload = running?.payload ?? null;
  const stable = releases?.stable ?? null;
  const stableList = Array.isArray(releases?.stableList)
    ? releases.stableList
    : [];

  const runningVersion = normalizeVersion(payload?.version);
  const releasedVersion = normalizeVersion(stable?.tag);
  const runningCommit =
    payload?.commit && payload.commit !== 'unknown' ? payload.commit : null;

  const base = {
    runningVersion,
    runningCommit,
    runningShortCommit: runningCommit ? runningCommit.slice(0, 7) : null,
    imageTag: payload?.imageTag ?? null,
    builtAt: payload?.builtAt ?? null,
    startedAt: payload?.startedAt ?? null,
    uptimeSeconds:
      typeof payload?.uptimeSeconds === 'number' ? payload.uptimeSeconds : null,
    fetchedAt: running?.fetchedAt ?? null,
    releasedVersion,
    releasedPublishedAt: stable?.publishedAt ?? null,
    releasedUrl: stable?.url ?? null,
    releasesBehind: null,
  };

  // Ordered: the first condition that holds wins. Reachability comes first
  // because a down deployment makes every version question moot.
  if (staging && staging.ok === false) {
    return {
      ...base,
      state: 'unreachable',
      severity: 'fail',
      label: 'Staging unreachable',
      detail: `Health check returned HTTP ${staging.httpCode ?? 0}, so the running version could not be determined.`,
    };
  }

  if (!payload) {
    return {
      ...base,
      state: 'unknown',
      severity: 'warn',
      label: 'Running version unknown',
      detail:
        'The deployment did not answer /api/version — expected until an image built after this endpoint was added has been released.',
    };
  }

  if (!releasedVersion) {
    return {
      ...base,
      state: 'no-release',
      severity: 'neutral',
      label: 'No stable release to compare against',
      detail: `Staging reports v${runningVersion ?? 'unknown'}, but no stable GitHub Release was found.`,
    };
  }

  if (runningVersion === releasedVersion) {
    return {
      ...base,
      state: 'in-sync',
      severity: 'pass',
      releasesBehind: 0,
      label: 'In sync',
      detail: `Staging is running the newest stable release, v${releasedVersion}.`,
    };
  }

  const index = stableList.findIndex(
    entry => normalizeVersion(entry?.tag) === runningVersion,
  );

  // stableList is newest-first, so the index *is* the number of releases the
  // running version is behind by. index === 0 is unreachable here: it would
  // mean it equals the newest stable, which the in-sync branch above caught.
  if (index > 0) {
    return {
      ...base,
      state: 'behind',
      severity: 'warn',
      releasesBehind: index,
      label: `${pluralize(index, 'release')} behind`,
      detail: `Staging is running v${runningVersion}; v${releasedVersion} has been released but is not deployed.`,
    };
  }

  return {
    ...base,
    state: 'diverged',
    severity: 'warn',
    label: 'Unrecognised version running',
    detail: `Staging reports v${runningVersion ?? 'unknown'}, which does not match any published stable release (newest is v${releasedVersion}).`,
  };
}
