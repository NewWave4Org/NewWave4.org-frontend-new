import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { computeDrift } from './drift.mjs';

function readJsonSafe(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function gitFallback(args, fallback = '') {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch {
    return fallback;
  }
}

function repositoryFromRemote() {
  const remote = gitFallback(['remote', 'get-url', 'origin']).replace(
    /\.git$/,
    '',
  );
  // Matches both git@github.com:org/repo and https://github.com/org/repo
  // (repo names may themselves contain dots, e.g. NewWave4.org-frontend-new,
  // so only the trailing .git suffix is stripped above, not dots in general).
  const match = remote.match(/github\.com[:/](.+)$/);
  return match ? match[1] : null;
}

function buildMeta() {
  const sha = process.env.GITHUB_SHA || gitFallback(['rev-parse', 'HEAD']);
  const refName =
    process.env.GITHUB_REF_NAME ||
    gitFallback(['rev-parse', '--abbrev-ref', 'HEAD']);
  const runId = process.env.GITHUB_RUN_ID || null;
  const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';
  const repository = process.env.GITHUB_REPOSITORY || repositoryFromRemote();
  const runUrl =
    runId && repository
      ? `${serverUrl}/${repository}/actions/runs/${runId}`
      : null;
  const commitUrl =
    repository && sha ? `${serverUrl}/${repository}/commit/${sha}` : null;
  const commitMessage = gitFallback(['log', '-1', '--format=%s'], '');

  return {
    sha,
    shortSha: sha ? sha.slice(0, 7) : 'unknown',
    refName,
    runUrl,
    commitUrl,
    commitMessage,
    repository,
    builtAt: new Date().toISOString(),
  };
}

function buildUnitSummary() {
  const raw = readJsonSafe('.status-data/vitest-results.json');
  const cwd = process.cwd();
  if (!raw) return null;

  const files = (raw.testResults || []).map(file => ({
    name: file.name.startsWith(cwd)
      ? file.name.slice(cwd.length + 1)
      : file.name,
    status: file.status,
    tests: (file.assertionResults || []).map(t => ({
      title: t.title,
      fullName: t.fullName,
      status: t.status,
      duration: t.duration ?? null,
    })),
  }));

  return {
    total: raw.numTotalTests ?? 0,
    passed: raw.numPassedTests ?? 0,
    failed: raw.numFailedTests ?? 0,
    skipped: (raw.numPendingTests ?? 0) + (raw.numTodoTests ?? 0),
    success: !!raw.success,
    files,
  };
}

function buildCoverageSummary() {
  const raw = readJsonSafe('coverage/coverage-summary.json');
  if (!raw || !raw.total) return null;
  const { lines, statements, functions, branches } = raw.total;
  return {
    lines: lines?.pct ?? null,
    statements: statements?.pct ?? null,
    functions: functions?.pct ?? null,
    branches: branches?.pct ?? null,
  };
}

function buildE2ESummary() {
  const raw = readJsonSafe('playwright-report/results.json');
  if (!raw) return null;

  const specs = [];

  const collectSpecs = suite => {
    for (const spec of suite.specs || []) {
      specs.push({
        file: suite.file || spec.file || 'unknown',
        title: spec.title,
        tests: (spec.tests || []).map(t => ({
          status: t.status,
          project: t.projectName,
        })),
      });
    }
    for (const child of suite.suites || []) collectSpecs(child);
  };

  for (const suite of raw.suites || []) collectSpecs(suite);

  const stats = raw.stats || {};
  return {
    total:
      (stats.expected ?? 0) + (stats.unexpected ?? 0) + (stats.skipped ?? 0),
    passed: stats.expected ?? 0,
    failed: stats.unexpected ?? 0,
    skipped: stats.skipped ?? 0,
    flaky: stats.flaky ?? 0,
    durationMs: stats.duration ?? null,
    specs,
  };
}

function buildReleases() {
  return readJsonSafe('.status-data/releases.json');
}

function buildStagingHealth() {
  return readJsonSafe('.status-data/staging-health.json');
}

// What staging says it is actually running, as opposed to what was released.
// Written by status-page.yml's "Check staging running version" step from
// GET https://new.newwave4.org/api/version.
function buildStagingVersion() {
  return readJsonSafe('.status-data/staging-version.json');
}

function buildEnv() {
  const pkg = readJsonSafe('package.json') || {};
  let nvmrc = null;
  try {
    nvmrc = readFileSync('.nvmrc', 'utf8').trim();
  } catch {
    nvmrc = null;
  }

  return {
    appVersion: pkg.version || 'unknown',
    node: nvmrc,
    next: pkg.dependencies?.next || null,
    react: pkg.dependencies?.react || null,
    playwright: pkg.devDependencies?.['@playwright/test'] || null,
    vitest: pkg.devDependencies?.vitest || null,
  };
}

export function gatherData() {
  const releases = buildReleases();
  const staging = buildStagingHealth();
  const running = buildStagingVersion();

  return {
    meta: buildMeta(),
    env: buildEnv(),
    releases,
    staging,
    running,
    deployment: computeDrift({ running, releases, staging }),
    unit: buildUnitSummary(),
    coverage: buildCoverageSummary(),
    e2e: buildE2ESummary(),
  };
}
