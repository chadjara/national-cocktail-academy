import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "build",
      ".react-router",
      "node_modules",
      "playwright-report",
      "test-results",
      "coverage",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.strict.rules,
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
      "@typescript-eslint/no-confusing-void-expression": ["error", { ignoreArrowShorthand: true }],
      "no-warning-comments": ["error", { terms: ["todo", "fixme", "xxx"], location: "start" }],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["dexie", "~/lib/db/database"],
              importNames: ["default", "getDatabase"],
              message:
                "Components and routes read data through feature hooks, never the database directly.",
            },
          ],
        },
      ],
    },
  },
  {
    // Repositories and the data layer are the only code allowed to open the database.
    files: ["src/lib/db/**", "src/features/*/repositories/**", "**/*.test.ts", "**/*.test.tsx"],
    rules: { "no-restricted-imports": "off" },
  },
  {
    files: ["**/*.{js,mjs}"],
    ...tseslint.configs.disableTypeChecked,
  },
);
