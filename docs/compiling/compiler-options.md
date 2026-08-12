# Compiler Options

Desmost provides many options to customise how it compiles your source code.

To configure options, pass in an `options` object when calling `compile()`:

```ts
compile(calc, source, {
  errors: "crash",
  ignore_comments: true,
});
```

All settings are optional with sensible defaults that should cover most use cases.


## Options

> [!Note]
> This table is auto-generated directly from [`options.ts`](../../desmost/src/compiler/options.ts) in the source code.

<!-- autodoc? -->

<!-- autodoc. -->
