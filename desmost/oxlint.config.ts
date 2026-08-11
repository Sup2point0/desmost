import { defineConfig } from "oxlint";


export default defineConfig({
  plugins: ["typescript"],
  categories: {
    nursery: "error",
    correctness: "error",
    suspicious: "warn",
    perf: "warn",
  },
  options: {
    typeAware: true,
  },
  env: {
    builtin: true,
    node: true,
  },
  ignorePatterns: [
    "*.test.ts",
    "**/node_modules/",
  ],
  rules: {
    "block-scoped-var": "off",
    "no-array-constructor": "error",
    "no-case-declarations": "error",
    "no-empty": "error",
    "no-fallthrough": "error",
    "no-implicit-coercion": "error",
    "no-lonely-if": "error",
    "no-prototype-builtins": "error",
    "no-redeclare": "error",
    "no-regex-spaces": "off",
    "no-sequences": "error",
    "no-undef": "off",
    "no-unexpected-multiline": "warn",
    "no-unmodified-loop-condition": "error",
    "no-unneeded-ternary": "error",
    "no-unreachable-loop": "error",
    "no-unused-expressions": "off",
    "no-unused-labels": "off",
    "no-unused-vars": ["error", { argsIgnorePattern: "(^_|^params$)", varsIgnorePattern: "^_" }],
    "no-useless-assignment": "error",
    "no-var": "off",
    "object-shorthand": "warn",
    "prefer-const": "off",
    "typescript/ban-ts-comment": "error",
    "typescript/explicit-member-accessibility": ["warn", {
      overrides: { constructors: "no-public" },
      ignoredMethodNames: [
        "parse_pre_sep", "parse_sep", "parse_post_sep",
        "try_parse_global_incantation", "try_parse_local_incantation", "try_parse_expr_incantation",
        "try_parse_identifier", "parse_incantation_arg",
      ],
    }],
    "typescript/no-confusing-void-expression": "error",
    "typescript/no-empty-object-type": "error",
    "typescript/no-explicit-any": "off",
    "typescript/no-extraneous-class": "off",
    "typescript/no-require-imports": "error",
    "typescript/no-unsafe-function-type": "error",
    "typescript/no-floating-promises": "error",
    "typescript/no-namespace": "off",
    "typescript/no-unnecessary-condition": "error",
    "typescript/no-unnecessary-type-assertion": "error",
    "typescript/no-unsafe-type-assertion": "off",
    "typescript/prefer-nullish-coalescing": "error",
    "typescript/strict-boolean-expressions": "error",
    "typescript/switch-exhaustiveness-check": "off"  // TEMP
  },
  overrides: [
    {
      files: [
        "src/magic/*/*.ts"
      ],
      rules: {
        "typescript/explicit-member-accessibility": "off"
      }
    }
  ],
})
