#!/usr/bin/env node
// The plain `npx semantic-release` CLI never writes to $GITHUB_OUTPUT (verified:
// no reference to GITHUB_OUTPUT or @actions/core anywhere in semantic-release's
// own dependency tree), so release.yml's downstream jobs — gated on
// `needs.release.outputs.new_release_published == 'true'` — would silently
// never run even after a real release. This wrapper uses semantic-release's
// documented Node API (which resolves to `false` when nothing was released,
// or a result object otherwise) and writes the outputs explicitly.
//
// semantic-release is a pure ESM package (`"type": "module"` in its own
// package.json) — this file uses the .mjs extension so Node loads it as ESM
// regardless of this repo's own CommonJS package.json.
import semanticRelease from 'semantic-release';
import { appendFileSync } from 'node:fs';

async function main() {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) {
    throw new Error('GITHUB_OUTPUT is not set — this script must run inside a GitHub Actions step.');
  }

  const result = await semanticRelease();

  if (result) {
    appendFileSync(outputPath, `new_release_published=true\n`);
    appendFileSync(outputPath, `new_release_version=${result.nextRelease.version}\n`);
    console.log(`Published release ${result.nextRelease.version}`);
  } else {
    appendFileSync(outputPath, `new_release_published=false\n`);
    console.log('No release published — no commits since the last release warranted a version bump.');
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
