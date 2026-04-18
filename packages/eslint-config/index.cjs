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
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", "node_modules", "storybook-static", "*.config.ts", "*.config.mjs", "scripts/**"],
  rules: {
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports", fixStyle: "separate-type-imports" },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
  },
  overrides: [
    {
      // Storybook CSF renders components via a `render` function. It is a
      // component factory in practice, but the eslint-plugin-react-hooks
      // heuristic (must start with uppercase) does not recognize it.
      files: ["**/*.stories.tsx", "**/*.stories.ts"],
      rules: {
        "react-hooks/rules-of-hooks": "off",
      },
    },
    {
      // Test files sometimes use the `act` helper conditionally.
      files: ["**/*.test.tsx", "**/*.test.ts"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
  ],
};
