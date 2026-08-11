import { defineConfig } from "oxlint";


export default defineConfig({
  plugins: ["typescript"],
  categories: {
    correctness: "error",
    suspicious: "warn",
    perf: "warn",
  },
  options: {
    typeAware: true
  },
  env: {
    builtin: true
  },
  ignorePatterns: [
    "*.test.ts",
    "**/node_modules/",
  ],
  rules: {
    // "constructor-super": "error",
    // "for-direction": "error",
    // "getter-return": "error",
    // "no-async-promise-executor": "error",
    // "no-case-declarations": "error",
    // "no-class-assign": "error",
    // "no-compare-neg-zero": "error",
    // "no-cond-assign": "error",
    // "no-const-assign": "error",
    // "no-constant-binary-expression": "error",
    // "no-constant-condition": "error",
    // "no-control-regex": "error",
    // "no-debugger": "error",
    // "no-delete-var": "error",
    // "no-dupe-class-members": "error",
    // "no-dupe-else-if": "error",
    // "no-dupe-keys": "error",
    // "no-duplicate-case": "error",
    // "no-empty": "error",
    // "no-empty-character-class": "error",
    // "no-empty-pattern": "error",
    // "no-empty-static-block": "error",
    // "no-ex-assign": "error",
    // "no-extra-boolean-cast": "error",
    // "no-fallthrough": "error",
    // "no-func-assign": "error",
    // "no-global-assign": "error",
    // "no-import-assign": "error",
    // "no-invalid-regexp": "error",
    // "no-irregular-whitespace": "error",
    // "no-loss-of-precision": "error",
    // "no-misleading-character-class": "error",
    // "no-new-native-nonconstructor": "error",
    // "no-nonoctal-decimal-escape": "error",
    // "no-obj-calls": "error",
    // "no-prototype-builtins": "error",
    // "no-redeclare": "error",
    // "no-regex-spaces": "error",
    // "no-self-assign": "error",
    // "no-setter-return": "error",
    // "no-shadow-restricted-names": "error",
    // "no-sparse-arrays": "error",
    // "no-this-before-super": "error",
    // "no-unassigned-vars": "error",
    // "no-undef": "error",
    // "no-unexpected-multiline": "error",
    // "no-unreachable": "error",
    // "no-unsafe-finally": "error",
    // "no-unsafe-negation": "error",
    // "no-unsafe-optional-chaining": "error",
    // "no-unused-labels": "error",
    // "no-unused-private-class-members": "error",
    // "no-unused-vars": "error",
    // "no-useless-assignment": "error",
    // "no-useless-backreference": "error",
    // "no-useless-catch": "error",
    // "no-useless-escape": "error",
    // "no-with": "error",
    // "preserve-caught-error": "error",
    // "require-yield": "error",
    // "use-isnan": "error",
    // "valid-typeof": "error",
    // "no-array-constructor": "error",
    // "no-unused-expressions": "error",
    // "typescript/ban-ts-comment": "error",
    // "typescript/no-duplicate-enum-values": "error",
    // "typescript/no-empty-object-type": "error",
    // "typescript/no-explicit-any": "error",
    // "typescript/no-extra-non-null-assertion": "error",
    // "typescript/no-misused-new": "error",
    // "typescript/no-namespace": "error",
    // "typescript/no-non-null-asserted-optional-chain": "error",
    // "typescript/no-require-imports": "error",
    // "typescript/no-this-alias": "error",
    // "typescript/no-unnecessary-type-constraint": "error",
    // "typescript/no-unsafe-declaration-merging": "error",
    // "typescript/no-unsafe-function-type": "error",
    // "typescript/no-wrapper-object-types": "error",
    // "typescript/prefer-as-const": "error",
    // "typescript/prefer-namespace-keyword": "error",
  },
  overrides: [
    {
      files: [
        "**/*.ts"
      ],
      rules: {
        "block-scoped-var": "off",
        "no-implicit-coercion": "error",
        "no-lonely-if": "error",
        "no-regex-spaces": "off",
        "no-sequences": "error",
        "no-undef": "off",
        "no-unexpected-multiline": "warn",
        "no-unmodified-loop-condition": "error",
        "no-unneeded-ternary": "error",
        "no-unreachable-loop": "error",
        "no-unused-labels": "off",
        "no-var": "off",
        "object-shorthand": "warn",
        "prefer-const": "off",
        "no-unused-expressions": "off",
        "no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "(^_|^params$)",
            varsIgnorePattern: "^_"
          }
        ],
        "typescript/explicit-member-accessibility": [ "warn", { overrides: { constructors: "no-public" } }],
        "typescript/no-confusing-void-expression": "error",
        "typescript/no-explicit-any": "off",
        "typescript/no-floating-promises": "error",
        "typescript/no-namespace": "off",
        "typescript/no-unnecessary-condition": "error",
        "typescript/no-unnecessary-type-assertion": "error",
        "typescript/no-unsafe-type-assertion": "off",
        "typescript/prefer-nullish-coalescing": "error",
        "typescript/strict-boolean-expressions": "error",
        "typescript/switch-exhaustiveness-check": "off"  // TEMP
      },
      env: {
        node: true
      }
    },
    {
      files: [
        "src/magic/*/*.ts"
      ],
      rules: {
        "typescript/explicit-member-accessibility": "off"
      }
    }
  ]
})
