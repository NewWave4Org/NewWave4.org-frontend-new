// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { blockingFiles } from './promotable.mjs';

let repo: string;

const git = (...args: string[]) =>
  execFileSync('git', args, { cwd: repo, encoding: 'utf8' }).trim();

function write(path: string, content: string) {
  mkdirSync(dirname(join(repo, path)), { recursive: true });
  writeFileSync(join(repo, path), content);
}

function commit(files: Record<string, string>): string {
  for (const [path, content] of Object.entries(files)) write(path, content);
  git('add', '-A');
  git('commit', '-q', '-m', 'test');
  return git('rev-parse', 'HEAD');
}

const pkg = (version: string, extra: object = {}) =>
  JSON.stringify({ name: 'app', version, ...extra }, null, 2);
const lock = (version: string, dep = '1.0.0') =>
  JSON.stringify(
    {
      name: 'app',
      version,
      packages: { '': { version }, 'node_modules/dep': { version: dep } },
    },
    null,
    2,
  );

let base: string;

beforeEach(() => {
  repo = mkdtempSync(join(tmpdir(), 'promotable-'));
  git('init', '-q');
  git('config', 'user.email', 'test@example.com');
  git('config', 'user.name', 'test');
  base = commit({
    'package.json': pkg('2.2.2-dev.3'),
    'package-lock.json': lock('2.2.2-dev.3'),
    'CHANGELOG.md': '# Changelog\n',
    'app/page.tsx': 'export default 1;\n',
    'helm/frontend-chart/Chart.yaml': 'version: 2.2.2-dev.3\n',
  });
});

afterEach(() => rmSync(repo, { recursive: true, force: true }));

describe('blockingFiles', () => {
  it('allows a release commit: versions, changelog and chart only', () => {
    const release = commit({
      'package.json': pkg('2.2.2'),
      'package-lock.json': lock('2.2.2'),
      'CHANGELOG.md': '# Changelog\n\n## 2.2.2\n',
      'helm/frontend-chart/Chart.yaml': 'version: 2.2.2\n',
    });
    expect(blockingFiles(base, release, repo)).toEqual([]);
  });

  it('allows docs, workflows and Markdown anywhere', () => {
    const target = commit({
      'docs/ci-cd.md': 'x\n',
      '.github/workflows/release.yml': 'x\n',
      'components/README.md': 'x\n',
    });
    expect(blockingFiles(base, target, repo)).toEqual([]);
  });

  it('blocks any source change', () => {
    const target = commit({ 'app/page.tsx': 'export default 2;\n' });
    expect(blockingFiles(base, target, repo)).toEqual(['app/page.tsx']);
  });

  it('blocks a dependency change hidden next to a version bump', () => {
    const target = commit({
      'package.json': pkg('2.2.2', { dependencies: { dep: '^2.0.0' } }),
      'package-lock.json': lock('2.2.2', '2.0.0'),
    });
    expect(blockingFiles(base, target, repo)).toEqual([
      'package-lock.json',
      'package.json',
    ]);
  });

  it('blocks new files that end up in the image', () => {
    const target = commit({ 'public/robots-extra.txt': 'x\n' });
    expect(blockingFiles(base, target, repo)).toEqual([
      'public/robots-extra.txt',
    ]);
  });

  it('blocks a deleted package.json rather than crashing', () => {
    git('rm', '-q', 'package.json');
    git('commit', '-q', '-m', 'rm');
    expect(blockingFiles(base, git('rev-parse', 'HEAD'), repo)).toEqual([
      'package.json',
    ]);
  });
});
