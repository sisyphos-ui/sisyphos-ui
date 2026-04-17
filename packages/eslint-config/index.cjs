/**
 * Shared ESLint config for Sisyphos UI packages.
 * Usage (in package eslintrc.cjs):
 *   module.exports = { extends: ["@sisyphos-ui/eslint-config"] };
 */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  env: { browser: true, es2022: true, node: true },
  settings: { react: { version: "detect" } },
  plugins: ["@typescript-eslint", "react", "react-hooks", "@sisyphos-ui/single-line-guard"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: [
    "dist",
    "node_modules",
    "storybook-static",
    "*.config.ts",
    "*.config.mjs",
    "scripts/**",
  ],
  rules: {
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/consistent-type-imports": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@sisyphos-ui/single-line-guard/prefer-single-line-guard": "warn",
  },
  overrides: [
    {
      files: [
        "**/*.spec.ts",
        "**/*.test.ts",
        "**/*.spec.tsx",
        "**/*.test.tsx",
        "**/__test__/**/*.ts",
        "**/__tests__/**/*.ts",
        "**/*.stories.tsx",
      ],
      rules: {
        "@sisyphos-ui/single-line-guard/prefer-remove-unused": "warn",
      },
    },
  ],
};
