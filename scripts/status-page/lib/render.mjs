export function escapeHtml(str) {
  return String(str ?? '').replace(
    /[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
}

function fmtPct(n) {
  return typeof n === 'number' ? `${n.toFixed(1)}%` : '—';
}

function fmtDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC',
    }) + ' UTC';
  } catch {
    return iso;
  }
}

function fmtMs(ms) {
  if (typeof ms !== 'number') return '—';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

// status: 'pass' | 'fail' | 'warn' | 'neutral'
export function pill(label, status = 'neutral') {
  return `<span class="pill pill-${status}">${escapeHtml(label)}</span>`;
}

function unitOverallStatus(unit) {
  if (!unit) return 'neutral';
  if (unit.failed > 0) return 'fail';
  return 'pass';
}

function e2eOverallStatus(e2e) {
  if (!e2e) return 'neutral';
  if (e2e.failed > 0) return 'fail';
  if (e2e.flaky > 0) return 'warn';
  return 'pass';
}

function stagingStatus(staging) {
  if (!staging) return 'neutral';
  return staging.ok ? 'pass' : 'fail';
}

export const STYLE = `
:root {
  color-scheme: dark;
  --bg: #0b0e14;
  --bg-elevated: #12161f;
  --border: #232a38;
  --text: #e6e9ef;
  --text-dim: #8b94a7;
  --accent: #6ee7c9;
  --accent-strong: #34d399;
  --pass: #34d399;
  --pass-bg: rgba(52, 211, 153, 0.12);
  --fail: #f87171;
  --fail-bg: rgba(248, 113, 113, 0.12);
  --warn: #fbbf24;
  --warn-bg: rgba(251, 191, 36, 0.12);
  --neutral: #9ca3af;
  --neutral-bg: rgba(156, 163, 175, 0.12);
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: radial-gradient(1200px 600px at 15% -10%, rgba(110, 231, 201, 0.08), transparent),
              var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.5;
}

.wrap {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px 64px;
}

header.top {
  padding: 40px 0 24px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 32px;
}

header.top h1 {
  font-size: 1.5rem;
  margin: 0 0 4px;
  letter-spacing: -0.02em;
}

header.top .tagline {
  color: var(--text-dim);
  font-size: 0.9rem;
}

nav.tabs {
  display: flex;
  gap: 4px;
  margin-top: 20px;
}

nav.tabs a {
  color: var(--text-dim);
  text-decoration: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  border: 1px solid transparent;
}

nav.tabs a:hover { color: var(--text); background: var(--bg-elevated); }
nav.tabs a.active {
  color: var(--accent);
  background: var(--bg-elevated);
  border-color: var(--border);
}

h2.section-title {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-dim);
  margin: 40px 0 14px;
}
h2.section-title:first-of-type { margin-top: 0; }

.card {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.stat-card a { color: inherit; text-decoration: none; display: block; }
.stat-card .label {
  color: var(--text-dim);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
}
.stat-card .value {
  font-size: 1.9rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.stat-card .sub {
  color: var(--text-dim);
  font-size: 0.82rem;
  margin-top: 6px;
}
.stat-card.linkable {
  transition: border-color 0.15s, transform 0.15s;
}
.stat-card.linkable:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
}
.pill-pass { color: var(--pass); background: var(--pass-bg); }
.pill-fail { color: var(--fail); background: var(--fail-bg); }
.pill-warn { color: var(--warn); background: var(--warn-bg); }
.pill-neutral { color: var(--neutral); background: var(--neutral-bg); }

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}
.hero .headline {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.hero .headline .pill { font-size: 1rem; padding: 4px 14px; }

table.breakdown {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}
table.breakdown th {
  text-align: left;
  color: var(--text-dim);
  font-weight: 500;
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
}
table.breakdown td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}
table.breakdown tr:last-child td { border-bottom: none; }
table.breakdown .file-row td { padding-top: 18px; font-weight: 600; color: var(--text); }
table.breakdown .test-row .title { color: var(--text-dim); padding-left: 20px; }
table.breakdown .duration { color: var(--text-dim); font-variant-numeric: tabular-nums; white-space: nowrap; }

code, .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.85em; }

a.inline-link { color: var(--accent); }

.releases {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.release-chip {
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  border-radius: 10px;
  padding: 10px 16px;
}
.release-chip .channel { font-size: 0.72rem; text-transform: uppercase; color: var(--text-dim); letter-spacing: 0.06em; }
.release-chip .tag { font-size: 1.1rem; font-weight: 700; }

footer.meta {
  margin-top: 48px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  color: var(--text-dim);
  font-size: 0.82rem;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
}

.links-row { display: flex; flex-wrap: wrap; gap: 10px 24px; }

.empty-note {
  color: var(--text-dim);
  font-size: 0.88rem;
  font-style: italic;
}
`;

export function layout({ title, active, body, meta }) {
  const nav = [
    ['index.html', 'Overview'],
    ['unit-tests.html', 'Unit Tests'],
    ['e2e-tests.html', 'E2E Tests'],
  ]
    .map(
      ([href, label]) =>
        `<a href="${href}" class="${active === href ? 'active' : ''}">${label}</a>`,
    )
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)} — NewWave4 Status</title>
<link rel="stylesheet" href="assets/style.css" />
</head>
<body>
<div class="wrap">
  <header class="top">
    <h1>NewWave4.org — Frontend Status</h1>
    <div class="tagline">Live build health, test results, and release info — regenerated on every push to <code>main</code>, nightly, and on demand.</div>
    <nav class="tabs">${nav}</nav>
  </header>
  ${body}
  <footer class="meta">
    <span>Commit <a class="inline-link" href="${meta.commitUrl || '#'}"><code>${escapeHtml(meta.shortSha)}</code></a> on <code>${escapeHtml(meta.refName)}</code></span>
    <span>Built ${escapeHtml(fmtDate(meta.builtAt))}</span>
    ${meta.runUrl ? `<span><a class="inline-link" href="${meta.runUrl}">View workflow run →</a></span>` : ''}
  </footer>
</div>
</body>
</html>`;
}

export function renderIndex(data) {
  const { meta, env, releases, staging, unit, coverage, e2e } = data;

  const overallStatus =
    unitOverallStatus(unit) === 'fail' || e2eOverallStatus(e2e) === 'fail' ? 'fail' : 'pass';
  const overallLabel = overallStatus === 'fail' ? 'Checks failing' : 'All checks passing';

  const releaseChips = releases
    ? `<div class="releases">
        ${
          releases.stable
            ? `<div class="release-chip"><div class="channel">Stable (main)</div><a class="inline-link tag" href="${releases.stable.url}">${escapeHtml(releases.stable.tag)}</a></div>`
            : '<div class="release-chip"><div class="channel">Stable (main)</div><div class="tag">—</div></div>'
        }
        ${
          releases.prerelease
            ? `<div class="release-chip"><div class="channel">Prerelease (development)</div><a class="inline-link tag" href="${releases.prerelease.url}">${escapeHtml(releases.prerelease.tag)}</a></div>`
            : '<div class="release-chip"><div class="channel">Prerelease (development)</div><div class="tag">—</div></div>'
        }
      </div>`
    : '<p class="empty-note">Release info not available for this build.</p>';

  const unitCard = unit
    ? `<a href="unit-tests.html">
        <div class="label">Unit Tests</div>
        <div class="value">${unit.passed}/${unit.total}</div>
        <div class="sub">${pill(unit.failed > 0 ? `${unit.failed} failing` : 'passing', unitOverallStatus(unit))}${unit.skipped ? ` · ${unit.skipped} skipped` : ''}</div>
      </a>`
    : `<div class="label">Unit Tests</div><div class="empty-note">Not available for this build.</div>`;

  const coverageCard = coverage
    ? `<div class="label">Coverage (lines)</div>
       <div class="value">${fmtPct(coverage.lines)}</div>
       <div class="sub">Statements ${fmtPct(coverage.statements)} · Functions ${fmtPct(coverage.functions)} · Branches ${fmtPct(coverage.branches)}</div>`
    : `<div class="label">Coverage</div><div class="empty-note">Not available for this build.</div>`;

  const e2eCard = e2e
    ? `<a href="e2e-tests.html">
        <div class="label">E2E Tests</div>
        <div class="value">${e2e.passed}/${e2e.total}</div>
        <div class="sub">${pill(e2e.failed > 0 ? `${e2e.failed} failing` : 'passing', e2eOverallStatus(e2e))}${e2e.skipped ? ` · ${e2e.skipped} skipped` : ''}</div>
      </a>`
    : `<div class="label">E2E Tests</div><div class="empty-note">Not available for this build.</div>`;

  const stagingCard = staging
    ? `<div class="label">Staging Reachability</div>
       <div class="value">${pill(staging.ok ? 'Reachable' : 'Unreachable', stagingStatus(staging))}</div>
       <div class="sub">HTTP ${staging.httpCode ?? '—'} in ${fmtMs(staging.latencyMs)} · checked ${fmtDate(staging.checkedAt)}</div>`
    : `<div class="label">Staging Reachability</div><div class="empty-note">Not checked for this build.</div>`;

  const envCard = `<div class="label">Environment</div>
     <div class="value" style="font-size:1.1rem">v${escapeHtml(env.appVersion)}</div>
     <div class="sub">Node ${escapeHtml(env.node || '—')} · Next ${escapeHtml((env.next || '').replace('^', '') || '—')} · React ${escapeHtml((env.react || '').replace('^', '') || '—')}</div>`;

  const linksRow = meta.repository
    ? `<div class="links-row">
        <a class="inline-link" href="https://github.com/${meta.repository}#readme">README</a>
        <a class="inline-link" href="https://github.com/${meta.repository}/blob/main/docs/testing.md">Testing philosophy</a>
        <a class="inline-link" href="https://github.com/${meta.repository}/blob/main/docs/known-issues.md">Known issues</a>
        <a class="inline-link" href="https://github.com/${meta.repository}/blob/main/docs/ci-cd.md">CI/CD pipeline</a>
        <a class="inline-link" href="https://github.com/${meta.repository}/releases">All releases</a>
      </div>`
    : '<p class="empty-note">Repository info not available for this build.</p>';

  const body = `
  <div class="hero">
    <div class="headline">${pill(overallLabel, overallStatus)}</div>
  </div>

  <h2 class="section-title">Releases</h2>
  ${releaseChips}

  <h2 class="section-title">Build health</h2>
  <div class="grid">
    <div class="card stat-card linkable">${unitCard}</div>
    <div class="card stat-card">${coverageCard}</div>
    <div class="card stat-card linkable">${e2eCard}</div>
    <div class="card stat-card">${stagingCard}</div>
    <div class="card stat-card">${envCard}</div>
  </div>

  <h2 class="section-title">More about this project</h2>
  ${linksRow}
  `;

  return layout({ title: 'Overview', active: 'index.html', body, meta });
}

export function renderUnitTests(data) {
  const { meta, unit, coverage } = data;

  let body;
  if (!unit) {
    body = `<h2 class="section-title">Unit tests</h2><p class="empty-note">No unit test results were available for this build.</p>`;
  } else {
    const coverageLine = coverage
      ? `<div class="sub" style="margin-bottom:24px">Coverage: ${fmtPct(coverage.lines)} lines · ${fmtPct(coverage.statements)} statements · ${fmtPct(coverage.functions)} functions · ${fmtPct(coverage.branches)} branches — <a class="inline-link" href="coverage/index.html">full interactive report →</a></div>`
      : '';

    const rows = unit.files
      .map(file => {
        const fileStatus = file.status === 'passed' ? 'pass' : file.status === 'failed' ? 'fail' : 'neutral';
        const testRows = file.tests
          .map(t => {
            const s = t.status === 'passed' ? 'pass' : t.status === 'failed' ? 'fail' : 'neutral';
            return `<tr class="test-row"><td></td><td class="title">${escapeHtml(t.title)}</td><td>${pill(t.status, s)}</td><td class="duration">${fmtMs(t.duration)}</td></tr>`;
          })
          .join('');
        return `<tr class="file-row"><td colspan="2"><code>${escapeHtml(file.name)}</code></td><td>${pill(file.status, fileStatus)}</td><td></td></tr>${testRows}`;
      })
      .join('');

    body = `
    <div class="hero">
      <div class="headline">${pill(`${unit.passed}/${unit.total} passing`, unitOverallStatus(unit))}</div>
    </div>
    ${coverageLine}
    <div class="card">
      <table class="breakdown">
        <thead><tr><th colspan="2">Test file / case</th><th>Status</th><th>Duration</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  }

  return layout({ title: 'Unit Tests', active: 'unit-tests.html', body, meta });
}

export function renderE2ETests(data) {
  const { meta, e2e } = data;

  let body;
  if (!e2e) {
    body = `<h2 class="section-title">E2E tests</h2><p class="empty-note">No E2E test results were available for this build.</p>`;
  } else {
    const bySpec = new Map();
    for (const spec of e2e.specs) {
      if (!bySpec.has(spec.file)) bySpec.set(spec.file, []);
      bySpec.get(spec.file).push(spec);
    }

    const rows = [...bySpec.entries()]
      .map(([file, specs]) => {
        const specRows = specs
          .map(spec => {
            const test = spec.tests[0] || {};
            const s = test.status === 'expected' ? 'pass' : test.status === 'unexpected' ? 'fail' : 'neutral';
            const label = test.status === 'expected' ? 'passed' : test.status === 'unexpected' ? 'failed' : 'skipped';
            return `<tr class="test-row"><td></td><td class="title">${escapeHtml(spec.title)}</td><td>${pill(label, s)}</td></tr>`;
          })
          .join('');
        return `<tr class="file-row"><td colspan="2"><code>${escapeHtml(file)}</code></td><td></td></tr>${specRows}`;
      })
      .join('');

    const skipNote = e2e.skipped
      ? `<p class="empty-note">${e2e.skipped} test${e2e.skipped === 1 ? '' : 's'} skipped — credential-gated specs (E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD) that only run with real staging credentials configured. See <a class="inline-link" href="https://github.com/${meta.repository}/blob/main/docs/testing.md">docs/testing.md</a>.</p>`
      : '';

    body = `
    <div class="hero">
      <div class="headline">${pill(`${e2e.passed}/${e2e.total} passing`, e2eOverallStatus(e2e))}</div>
    </div>
    <p class="sub" style="margin-bottom:24px">Ran in ${fmtMs(e2e.durationMs)} — <a class="inline-link" href="e2e-report/index.html">full interactive Playwright report →</a></p>
    ${skipNote}
    <div class="card">
      <table class="breakdown">
        <thead><tr><th colspan="2">Spec / case</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  }

  return layout({ title: 'E2E Tests', active: 'e2e-tests.html', body, meta });
}
