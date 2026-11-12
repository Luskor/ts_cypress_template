import tseslint from "typescript-eslint";
import cypressPlugin from "eslint-plugin-cypress";
import mochaPlugin from "eslint-plugin-mocha";
import prettierPluginRecommended from "eslint-plugin-prettier/recommended";

export default [
  {
    // TODO: Add project-specific ignores, globals, and rule overrides when the real codebase is integrated.
    ignores: [
      "node_modules",
      "reports/**",
      "cypress/videos",
      "cypress/screenshots",
      "cypress/downloads",
    ],
  },
  ...tseslint.configs.recommended,
  cypressPlugin.configs.recommended,
  cypressPlugin.configs.globals,
  mochaPlugin.configs.recommended,
  prettierPluginRecommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: "./tsconfig.json" },
    },
    rules: {
      "mocha/no-mocha-arrows": "error",
      "mocha/no-top-level-hooks": "off",
      "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true }],
    },
  },
];
