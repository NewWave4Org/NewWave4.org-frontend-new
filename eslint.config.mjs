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
      'no-debugger':
        process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    },
  },
];

export default eslintConfig;
