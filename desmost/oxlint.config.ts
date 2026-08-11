import { defineConfig, type DummyRuleMap } from "oxlint";


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
  rules: set_rules({
    "array-callback-return": true,
    "block-scoped-var": false,
    "default-case-last": true,
    "no-array-constructor": true,
    "no-case-declarations": true,
    "no-empty": true,
    "no-fallthrough": true,
    "no-implicit-coercion": true,
    "no-lonely-if": true,
    "no-prototype-builtins": true,
    "no-redeclare": true,
    "no-regex-spaces": false,
    "no-return-assign": true,
    "no-sequences": true,
    "no-undef": false,
    "no-unexpected-multiline": "warn",
    "no-unmodified-loop-condition": true,
    "no-unneeded-ternary": true,
    "no-unreachable-loop": true,
    "no-unused-expressions": false,
    "no-unused-labels": false,
    "no-unused-vars": ["error", { argsIgnorePattern: "(^_|^params$)", varsIgnorePattern: "^_" }],
    "no-useless-assignment": true,
    "no-var": false,
    "object-shorthand": "warn",
    "prefer-const": false,

    "typescript/ban-ts-comment": true,
    "typescript/explicit-member-accessibility": ["warn", {
      overrides: { constructors: "no-public" },
      ignoredMethodNames: [
        "parse_pre_sep", "parse_sep", "parse_post_sep",
        "try_parse_global_incantation", "try_parse_local_incantation", "try_parse_expr_incantation",
        "try_parse_identifier", "parse_incantation_arg",
      ],
    }],
    "typescript/explicit-module-boundary-types": true,
    "typescript/no-confusing-void-expression": true,
    "typescript/no-empty-object-type": true,
    "typescript/no-explicit-any": false,
    "typescript/no-extraneous-class": false,
    "typescript/no-floating-promises": true,
    "typescript/no-import-type-side-effects": true,
    "typescript/no-mixed-enums": true,
    "typescript/no-namespace": false,
    "typescript/no-require-imports": true,
    "typescript/no-unnecessary-condition": true,
    "typescript/no-unnecessary-type-assertion": true,
    "typescript/no-unsafe-call": true,
    "typescript/no-unsafe-function-type": true,
    "typescript/no-unsafe-return": true,
    "typescript/no-unsafe-type-assertion": false,
    "typescript/prefer-nullish-coalescing": true,
    "typescript/strict-boolean-expressions": true,
    "typescript/switch-exhaustiveness-check": false  // TEMP
  }),
  overrides: [
    {
      files: [
        "src/magic/*/*.ts"
      ],
      rules: set_rules({
        "typescript/explicit-member-accessibility": false,
        "typescript/explicit-module-boundary-types": false,
      }),
    },
  ],
});


function set_rules(
  rules: {
    [K in keyof DummyRuleMap]?: boolean | DummyRuleMap[K];
  }
): DummyRuleMap
{
  for (let [key, value] of Object.entries(rules)) {
    switch (value) {
      case true:  rules[key] = "error"; break;
      case false: rules[key] = "off";   break;
    }
  }

  return rules as DummyRuleMap;
}
