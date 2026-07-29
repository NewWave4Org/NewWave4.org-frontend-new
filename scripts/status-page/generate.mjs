#!/usr/bin/env node
// Builds the static status dashboard published to GitHub Pages
// (.github/workflows/status-page.yml). Reads only already-fetched JSON files
// under .status-data/ plus the existing coverage/ and playwright-report/
// artifacts -- this script itself makes no network calls, so it can be run
// locally with no secrets (missing inputs just render an honest "not
// available" section instead of crashing -- see docs comment in lib/data.mjs).
import { existsSync, mkdirSync, rmSync, writeFileSync, cpSync } from 'node:fs';
import { gatherData } from './lib/data.mjs';
import {
  STYLE,
  renderIndex,
  renderUnitTests,
  renderE2ETests,
} from './lib/render.mjs';

const OUT_DIR = 'status-site';

function main() {
  const data = gatherData();

  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(`${OUT_DIR}/assets`, { recursive: true });

  writeFileSync(`${OUT_DIR}/index.html`, renderIndex(data));
  writeFileSync(`${OUT_DIR}/unit-tests.html`, renderUnitTests(data));
  writeFileSync(`${OUT_DIR}/e2e-tests.html`, renderE2ETests(data));
  writeFileSync(`${OUT_DIR}/assets/style.css`, STYLE);
  writeFileSync(`${OUT_DIR}/data.json`, JSON.stringify(data, null, 2));

  if (existsSync('coverage')) {
    cpSync('coverage', `${OUT_DIR}/coverage`, { recursive: true });
  }
  if (existsSync('playwright-report')) {
    cpSync('playwright-report', `${OUT_DIR}/e2e-report`, { recursive: true });
  }

  console.log(`Status page generated at ./${OUT_DIR}/`);
  console.log(
    `  Unit tests: ${data.unit ? `${data.unit.passed}/${data.unit.total}` : 'not available'}`,
  );
  console.log(
    `  E2E tests:  ${data.e2e ? `${data.e2e.passed}/${data.e2e.total}` : 'not available'}`,
  );
  console.log(`  Releases:   ${data.releases ? 'available' : 'not available'}`);
  console.log(
    `  Staging:    ${data.staging ? (data.staging.ok ? 'reachable' : 'unreachable') : 'not checked'}`,
  );
  console.log(
    `  Deployment: ${data.deployment.state} — ${data.deployment.label}`,
  );
}

main();
