export function escapeHtml(str) {
  return String(str ?? '').replace(
    /[&<>"']/g,
    c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ],
  );
}

function fmtPct(n) {
  return typeof n === 'number' ? `${n.toFixed(1)}%` : '—';
}

function fmtDate(iso) {
  if (!iso) return '—';
  try {
    return (
      new Date(iso).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'UTC',
      }) + ' UTC'
    );
  } catch {
    return iso;
  }
}

function fmtMs(ms) {
  if (typeof ms !== 'number') return '—';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function fmtDuration(seconds) {
  if (typeof seconds !== 'number' || seconds < 0) return '—';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// Relative age, resolved against page-build time. The page is a static
// snapshot, so this is honest only next to the absolute timestamp it
// accompanies -- always render both.
function fmtAgo(iso) {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return 'just now';
  return `${fmtDuration(seconds)} ago`;
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

/* Severity-tinted cards, used by the Deployment section so drift is readable
   at a glance rather than only via the pill text. Reuses the existing
   --pass/--warn/--fail custom properties -- no new colours. */
.card--pass { border-left: 3px solid var(--pass); background: linear-gradient(90deg, var(--pass-bg), var(--bg-elevated) 260px); }
.card--warn { border-left: 3px solid var(--warn); background: linear-gradient(90deg, var(--warn-bg), var(--bg-elevated) 260px); }
.card--fail { border-left: 3px solid var(--fail); background: linear-gradient(90deg, var(--fail-bg), var(--bg-elevated) 260px); }
.card--neutral { border-left: 3px solid var(--neutral); }

.deploy-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}
@media (max-width: 720px) {
  .deploy-grid { grid-template-columns: 1fr; }
}

.kv {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  color: var(--text-dim);
  font-size: 0.82rem;
}
.kv > span { white-space: nowrap; }
.kv .k { color: var(--text-dim); opacity: 0.75; margin-right: 4px; }
.kv .v { color: var(--text); }
/* .stat-card a is display:block (it exists so the unit/E2E cards can be one
   big click target). The commit link here is mid-sentence, so undo that or it
   breaks its own key/value pair onto a second line. */
.kv a { display: inline; }

.caveat {
  color: var(--text-dim);
  font-size: 0.8rem;
  margin-top: 12px;
  line-height: 1.6;
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
    <div class="tagline">What is deployed right now, plus build health, test results, and release info — regenerated after every release to <code>main</code>, nightly, and on demand.</div>
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

// The Deployment section: what staging is *actually* running, next to what was
// actually released. Before this existed the page could show v1.2.0 as the
// newest release while staging quietly served v1.1.0, with nothing to reveal
// the gap -- every version on the page came from the build, none from the
// running deployment.
function renderDeployment(data) {
  const { deployment, staging, releases, meta } = data;

  const kv = [];
  if (deployment.runningShortCommit) {
    const sha = escapeHtml(deployment.runningShortCommit);
    kv.push(
      `<span><span class="k">commit</span><span class="v"><code>${
        meta.repository
          ? `<a class="inline-link" href="https://github.com/${meta.repository}/commit/${escapeHtml(deployment.runningCommit)}">${sha}</a>`
          : sha
      }</code></span></span>`,
    );
  }
  if (deployment.imageTag) {
    kv.push(
      `<span><span class="k">image tag</span><span class="v"><code>${escapeHtml(deployment.imageTag)}</code></span></span>`,
    );
  }
  if (deployment.builtAt) {
    kv.push(
      `<span><span class="k">image built</span><span class="v">${escapeHtml(fmtDate(deployment.builtAt))}</span></span>`,
    );
  }
  if (deployment.startedAt) {
    const ago = fmtAgo(deployment.startedAt);
    kv.push(
      `<span><span class="k">running since</span><span class="v">${escapeHtml(fmtDate(deployment.startedAt))}${ago ? ` (${escapeHtml(ago)})` : ''}</span></span>`,
    );
  } else if (typeof deployment.uptimeSeconds === 'number') {
    kv.push(
      `<span><span class="k">uptime</span><span class="v">${escapeHtml(fmtDuration(deployment.uptimeSeconds))}</span></span>`,
    );
  }
  if (staging) {
    kv.push(
      `<span><span class="k">health</span><span class="v">HTTP ${staging.httpCode ?? '—'} in ${fmtMs(staging.latencyMs)}</span></span>`,
    );
  }
  if (deployment.fetchedAt || staging?.checkedAt) {
    kv.push(
      `<span><span class="k">checked</span><span class="v">${escapeHtml(fmtDate(deployment.fetchedAt || staging?.checkedAt))}</span></span>`,
    );
  }

  const runningCard = `
    <div class="card stat-card card--${deployment.severity}">
      <div class="label">Running now — staging</div>
      <div class="value">${deployment.runningVersion ? `v${escapeHtml(deployment.runningVersion)}` : '—'}</div>
      <div class="sub">${pill(deployment.label, deployment.severity)}</div>
      ${deployment.detail ? `<div class="sub">${escapeHtml(deployment.detail)}</div>` : ''}
      ${kv.length ? `<div class="kv">${kv.join('')}</div>` : ''}
    </div>`;

  const stable = releases?.stable ?? null;
  const publishedAgo = stable ? fmtAgo(stable.publishedAt) : null;
  const latestCard = `
    <div class="card stat-card">
      <div class="label">Latest stable release</div>
      <div class="value">${
        stable
          ? `<a class="inline-link" href="${stable.url}">${escapeHtml(stable.tag)}</a>`
          : '—'
      }</div>
      <div class="sub">${
        stable
          ? `${escapeHtml(fmtDate(stable.publishedAt))}${publishedAgo ? ` · ${escapeHtml(publishedAgo)}` : ''}`
          : 'No stable release published yet.'
      }</div>
    </div>`;

  // Both caveats are real and neither is fixable from here, so they are stated
  // rather than glossed over: the reading comes from whichever of the two
  // replicas answered, and process uptime is not deploy time.
  const caveat = `<p class="caveat">Sampled over HTTP from whichever replica answered
    (<code>replicaCount: 2</code>), so during a rollout the two can legitimately differ.
    &ldquo;Running since&rdquo; is the answering process&rsquo;s start time — close to the deploy
    time in practice, but it also resets on any pod restart or eviction.</p>`;

  return `
  <h2 class="section-title">Deployment</h2>
  <div class="deploy-grid">
    ${runningCard}
    ${latestCard}
  </div>
  ${caveat}`;
}

export function renderIndex(data) {
  const { meta, env, releases, unit, coverage, e2e, deployment } = data;

  // Ordered precedence, first match wins. Drift is deliberately loud enough to
  // reach the hero: a deployment stuck on an old release is exactly the kind of
  // problem that stays invisible when every other check is green.
  let overallStatus = 'pass';
  let overallLabel = 'All checks passing';
  if (unitOverallStatus(unit) === 'fail' || e2eOverallStatus(e2e) === 'fail') {
    overallStatus = 'fail';
    overallLabel = 'Checks failing';
  } else if (deployment?.state === 'unreachable') {
    overallStatus = 'fail';
    overallLabel = 'Staging unreachable';
  } else if (deployment?.severity === 'warn') {
    overallStatus = 'warn';
    overallLabel = 'Deployment drift detected';
  }

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

  // Deliberately labelled "source tree", not just a bare version: this is
  // package.json at the commit the *status page* was built from, which is
  // neither the released version nor the running one. Reading it as "the
  // deployed version" is precisely the confusion the Deployment section exists
  // to remove, so it says what it is.
  const envCard = `<div class="label">Build environment</div>
     <div class="value" style="font-size:1.1rem">v${escapeHtml(env.appVersion)}</div>
     <div class="sub">Source tree this page was built from — not necessarily what is deployed.</div>
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

  ${renderDeployment(data)}

  <h2 class="section-title">Releases</h2>
  ${releaseChips}

  <h2 class="section-title">Build health</h2>
  <div class="grid">
    <div class="card stat-card linkable">${unitCard}</div>
    <div class="card stat-card">${coverageCard}</div>
    <div class="card stat-card linkable">${e2eCard}</div>
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
        const fileStatus =
          file.status === 'passed'
            ? 'pass'
            : file.status === 'failed'
              ? 'fail'
              : 'neutral';
        const testRows = file.tests
          .map(t => {
            const s =
              t.status === 'passed'
                ? 'pass'
                : t.status === 'failed'
                  ? 'fail'
                  : 'neutral';
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
            const s =
              test.status === 'expected'
                ? 'pass'
                : test.status === 'unexpected'
                  ? 'fail'
                  : 'neutral';
            const label =
              test.status === 'expected'
                ? 'passed'
                : test.status === 'unexpected'
                  ? 'failed'
                  : 'skipped';
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
