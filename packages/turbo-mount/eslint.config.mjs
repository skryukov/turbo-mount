import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    extends: [
      pluginJs.configs.recommended,
      tseslint.configs.recommended,
    ],
  }
);
