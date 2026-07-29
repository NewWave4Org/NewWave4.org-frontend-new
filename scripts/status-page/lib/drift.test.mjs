import { describe, expect, it } from 'vitest';
import { computeDrift, normalizeVersion } from './drift.mjs';

const RELEASES = {
  stable: {
    tag: 'v1.2.0',
    url: 'https://github.com/org/repo/releases/tag/v1.2.0',
    publishedAt: '2026-07-29T09:00:00Z',
  },
  prerelease: { tag: 'v1.3.0-dev.1' },
  stableList: [
    { tag: 'v1.2.0', publishedAt: '2026-07-29T09:00:00Z' },
    { tag: 'v1.1.1', publishedAt: '2026-07-25T09:00:00Z' },
    { tag: 'v1.1.0', publishedAt: '2026-07-20T09:00:00Z' },
  ],
};

const HEALTHY = {
  ok: true,
  httpCode: 200,
  latencyMs: 120,
  checkedAt: '2026-07-29T10:00:00Z',
};

function runningAt(version, extra = {}) {
  return {
    httpCode: 200,
    fetchedAt: '2026-07-29T10:00:00Z',
    payload: {
      version,
      commit: '69415ab1234567890abcdef1234567890abcdef1',
      imageTag: version,
      builtAt: '2026-07-29T08:55:00Z',
      startedAt: '2026-07-29T09:05:00Z',
      uptimeSeconds: 3300,
      ...extra,
    },
  };
}

describe('normalizeVersion', () => {
  it('strips a single leading v from git-tag-style versions', () => {
    expect(normalizeVersion('v1.2.0')).toBe('1.2.0');
  });

  it('leaves bare semver untouched', () => {
    expect(normalizeVersion('1.2.0')).toBe('1.2.0');
  });

  it('preserves prerelease suffixes', () => {
    expect(normalizeVersion('v1.3.0-dev.2')).toBe('1.3.0-dev.2');
  });

  it('returns null for missing, empty, or non-string input', () => {
    expect(normalizeVersion(undefined)).toBeNull();
    expect(normalizeVersion(null)).toBeNull();
    expect(normalizeVersion('   ')).toBeNull();
    expect(normalizeVersion(120)).toBeNull();
  });
});

describe('computeDrift', () => {
  it('reports in-sync when the running version matches the newest stable release', () => {
    const result = computeDrift({
      running: runningAt('1.2.0'),
      releases: RELEASES,
      staging: HEALTHY,
    });

    expect(result.state).toBe('in-sync');
    expect(result.severity).toBe('pass');
    expect(result.releasesBehind).toBe(0);
    expect(result.runningVersion).toBe('1.2.0');
    expect(result.releasedVersion).toBe('1.2.0');
  });

  it('counts how many releases behind the running version is', () => {
    const result = computeDrift({
      running: runningAt('1.1.0'),
      releases: RELEASES,
      staging: HEALTHY,
    });

    expect(result.state).toBe('behind');
    expect(result.severity).toBe('warn');
    expect(result.releasesBehind).toBe(2);
    expect(result.label).toBe('2 releases behind');
  });

  it('singularizes the label when exactly one release behind', () => {
    const result = computeDrift({
      running: runningAt('1.1.1'),
      releases: RELEASES,
      staging: HEALTHY,
    });

    expect(result.releasesBehind).toBe(1);
    expect(result.label).toBe('1 release behind');
  });

  it('flags a running version that matches no published stable release', () => {
    const result = computeDrift({
      running: runningAt('9.9.9'),
      releases: RELEASES,
      staging: HEALTHY,
    });

    expect(result.state).toBe('diverged');
    expect(result.severity).toBe('warn');
    expect(result.releasesBehind).toBeNull();
  });

  it('treats an unreachable deployment as a failure, not as drift', () => {
    const result = computeDrift({
      running: runningAt('1.1.0'),
      releases: RELEASES,
      staging: {
        ok: false,
        httpCode: 503,
        latencyMs: 5000,
        checkedAt: '2026-07-29T10:00:00Z',
      },
    });

    expect(result.state).toBe('unreachable');
    expect(result.severity).toBe('fail');
  });

  it('degrades to unknown rather than false in-sync when the endpoint is absent', () => {
    // The real shape produced by status-page.yml against an image predating
    // /api/version: reachable, HTTP 404, payload nulled out by the jq guard.
    const result = computeDrift({
      running: {
        httpCode: 404,
        payload: null,
        fetchedAt: '2026-07-29T10:00:00Z',
      },
      releases: RELEASES,
      staging: HEALTHY,
    });

    expect(result.state).toBe('unknown');
    expect(result.severity).toBe('warn');
    expect(result.runningVersion).toBeNull();
    expect(result.releasedVersion).toBe('1.2.0');
  });

  it('reports no-release when nothing stable has been published yet', () => {
    const result = computeDrift({
      running: runningAt('1.0.0'),
      releases: { stable: null, prerelease: null, stableList: [] },
      staging: HEALTHY,
    });

    expect(result.state).toBe('no-release');
    expect(result.severity).toBe('neutral');
  });

  it('falls back to diverged when releases.json predates stableList', () => {
    // Backwards compatibility: a cached/older releases.json has stable but no
    // stableList, so "how far behind" is uncomputable — but drift is still
    // detectable and must not be silently swallowed.
    const result = computeDrift({
      running: runningAt('1.1.0'),
      releases: { stable: RELEASES.stable, prerelease: null },
      staging: HEALTHY,
    });

    expect(result.state).toBe('diverged');
    expect(result.severity).toBe('warn');
  });

  it('handles every input being null without throwing', () => {
    const result = computeDrift({});

    expect(result.state).toBe('unknown');
    expect(result.severity).toBe('warn');
    expect(result.runningVersion).toBeNull();
    expect(result.releasedVersion).toBeNull();
  });

  it('surfaces the running build metadata for rendering', () => {
    const result = computeDrift({
      running: runningAt('1.2.0'),
      releases: RELEASES,
      staging: HEALTHY,
    });

    expect(result.runningShortCommit).toBe('69415ab');
    expect(result.imageTag).toBe('1.2.0');
    expect(result.builtAt).toBe('2026-07-29T08:55:00Z');
    expect(result.startedAt).toBe('2026-07-29T09:05:00Z');
    expect(result.uptimeSeconds).toBe(3300);
    expect(result.releasedUrl).toBe(RELEASES.stable.url);
  });

  it('treats the literal "unknown" commit placeholder as no commit', () => {
    // The Dockerfile's ARG default, seen on any locally-built image.
    const result = computeDrift({
      running: runningAt('1.2.0', { commit: 'unknown' }),
      releases: RELEASES,
      staging: HEALTHY,
    });

    expect(result.runningCommit).toBeNull();
    expect(result.runningShortCommit).toBeNull();
  });
});
