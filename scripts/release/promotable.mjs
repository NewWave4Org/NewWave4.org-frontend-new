#!/usr/bin/env node
// Can an image built from <source> be promoted to <target> without a rebuild?
//
//   node scripts/release/promotable.mjs <source-commit> <target-commit>
//
// Yes (exit 0) when every file that differs between the two commits is one
// that cannot change what `docker build` produces:
//   - release bookkeeping: CHANGELOG.md, and package.json / package-lock.json
//     when the only difference is their own "version" fields;
//   - files outside the image: docs/, .github/, helm/ (the chart is published
//     separately, from the target commit), and Markdown anywhere.
// Otherwise exit 1 and list the files that block promotion. Exit 2 on misuse.
//
// release.yml uses this on main: the image built and tested on development is
// promoted to the release (staging, then production) when main's code is
// identical to it. Anything that could change the image means a fresh build
// and the full quality gates, so promotion is never weaker than rebuilding.

import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';

const OUTSIDE_IMAGE = [/^docs\//, /^\.github\//, /^helm\//, /\.md$/];

function git(args, cwd) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
}

function withoutVersions(path, text) {
  const json = JSON.parse(text);
  delete json.version;
  if (path === 'package-lock.json' && json.packages?.['']) {
    delete json.packages[''].version;
  }
  return json;
}

function versionOnlyChange(path, source, target, cwd) {
  try {
    const a = withoutVersions(path, git(['show', `${source}:${path}`], cwd));
    const b = withoutVersions(path, git(['show', `${target}:${path}`], cwd));
    return isDeepStrictEqual(a, b);
  } catch {
    // Added, deleted or unparsable on one side: not a version-only change.
    return false;
  }
}

/** Files that differ in a way that could change the built image. */
export function blockingFiles(source, target, cwd = process.cwd()) {
  const changed = git(
    ['diff', '--name-only', '--no-renames', '-z', source, target],
    cwd,
  )
    .split('\0')
    .filter(Boolean);

  return changed.filter(path => {
    if (path === 'CHANGELOG.md') return false;
    if (OUTSIDE_IMAGE.some(pattern => pattern.test(path))) return false;
    if (path === 'package.json' || path === 'package-lock.json') {
      return !versionOnlyChange(path, source, target, cwd);
    }
    return true;
  });
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const [source, target] = process.argv.slice(2);
  if (!source || !target) {
    console.error(
      'usage: node scripts/release/promotable.mjs <source> <target>',
    );
    process.exit(2);
  }
  const blocking = blockingFiles(source, target);
  if (blocking.length === 0) {
    console.log(
      `promotable: ${source} and ${target} build the same image (only release bookkeeping or files outside the image differ).`,
    );
    process.exit(0);
  }
  console.log(
    `not promotable: ${blocking.length} file(s) that end up in the image differ between ${source} and ${target}:`,
  );
  for (const path of blocking) console.log(`  ${path}`);
  process.exit(1);
}
