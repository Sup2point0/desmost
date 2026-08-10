import path from "node:path";

import { defineConfig, includeIgnoreFile } from "eslint/config";
import js from "@eslint/js";
import ts from "typescript-eslint";
import globals from "globals";


export default defineConfig(
  includeIgnoreFile(path.resolve(".gitignore")),
  js.configs.recommended,
  ts.configs.recommended,
  {
    files: ["**/*.{js,ts}"],
    plugins: { js },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "no-implicit-coercion": "error",
      "no-lonely-if": "error",
      "no-regex-spaces": "off",
      "no-sequences": "error",
      "no-undef": "off",
      "no-unmodified-loop-condition": "error",
      "no-unneeded-ternary": "error",
      "no-unreachable-loop": "error",
      "no-unused-labels": "off",
      "no-var": "off",
      "no-unexpected-multiline": "warn",
      "object-shorthand": "warn",
      "prefer-const": "off",
      "@typescript-eslint/explicit-member-accessibility": "error",
      "@typescript-eslint/no-confusing-void-expression": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "(^_|^params$)", varsIgnorePattern: "^_" }
      ],
    },
  },
);
