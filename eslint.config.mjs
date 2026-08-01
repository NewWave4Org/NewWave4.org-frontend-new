import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettier,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      semi: ['error', 'always'],
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      // console.error/warn are legitimate diagnostics and stay; log/info are
      // debug leftovers. 66 of them had accumulated across 32 files (issue
      // #457), including a plaintext password and donor PII. Note this rule
      // cannot actually run yet -- npm run lint is broken under TypeScript 7
      // (issue #454) -- so the enforceable guard today is the no-console-log
      // job in _quality-gates.yml. This is here so the two agree the moment
      // lint works again.
      'no-console': ['error', { allow: ['error', 'warn'] }],
      'no-debugger':
        process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    },
  },
];

export default eslintConfig;
