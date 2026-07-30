module.exports = {
  branches: ['main', { name: 'development', prerelease: 'dev' }],
  tagFormat: 'v${version}',
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    ['@semantic-release/release-notes-generator', { preset: 'conventionalcommits' }],
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    ['@semantic-release/npm', { npmPublish: false }],
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'bash scripts/release/bump-chart-version.sh ${nextRelease.version}',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'package-lock.json', 'CHANGELOG.md', 'helm/frontend-chart/Chart.yaml'],
        // Deliberately carries no CI-skip marker. It used to, purely to stop
        // release.yml re-triggering on its own bump commit -- but GitHub applies
        // that marker to EVERY workflow and every trigger type for the commit,
        // so it also silenced ci.yml, pr-title-lint, restrict-main-merges and
        // e2e on any PR whose head landed on one of these commits. That left
        // promotion PRs with zero check runs, permanently unmergeable, four
        // separate times. release.yml now guards its own entry job on the
        // commit subject instead, which is the narrow behaviour we actually
        // wanted. See docs/known-issues.md.
        message: 'chore(release): ${nextRelease.version}\n\n${nextRelease.notes}',
      },
    ],
    '@semantic-release/github',
  ],
};
