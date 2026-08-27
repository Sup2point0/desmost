# Compiler Options

Desmost provides many options to customise how it compiles your source code.

To configure options, pass in a `DesmostOptions` object when calling `compile()`:

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
| Option | Values | Default | Description |
| :----- | :----- | :------ | :---------- |
| **errors** | `"surface"` `"crash"` `"suppress"` | `surface` | How should errors be *surfaced* to the end user?<br><br>- `surface` (default): Blocks that result in errors will become Desmos text expressions containing the error message, leaving other expressions unaffected.<br><br>- `crash`: The entire compilation to Desmos will terminate with a single error message. This means you don't get any output at all, but errors are also immediately obvious.<br>   - Note that this will *clear all expressions* in the calculator instance.<br><br>- `suppress`: Silently fail on the frontend (if you wish to give the illusion that everything is fine). |
| **place_errors** | `"inline"` `"end"` `"start"` | `inline` | Where should errors be placed?<br><br>- `inline` (default): Alongside or in place of the expression that produced it.<br>- `end`: All aggregated at the end of the Desmos expressions list.<br>- `start`: All aggregated at the start of the Desmos expressions list. |
| **error_prefix** | `string` | `[DESMOST ERROR]\n` | The prefix to prepend to error blocks.<br><br>Provide a `""` blank string if you wish for no prefix to be added. |
| **expand_errors** | `true` `false` | `true`, meaning all output is shown. | Show all the available diagnostics for errors, including hints and debug information? |
| **check_args** | `true` `false` | `true`, meaning arguments are checked. | Error if an incantation receives a `{}` object argument with unknown fields?<br><br>This also errors if an incantation receives an empty `{}` object.<br><br>For instance, `/label{position: LEFT}` is invalid; it should be `/label{pos: LEFT}`. With `check_args: false`, this silently no-ops; with `check_args: true`, it flags an error.<br><br>Desmost doesn’t remove unknown fields, it just passes them directly to the Desmos API. If you know what you’re doing and a field you know exists isn’t supported by Desmos, you can disable this to avoid erroring. |
| **prettify** | `true` `false` | `true`, meaning LaTeX is prettified. | Prettify LaTeX output so it renders nicely in the Desmos editor? |
| **dedent_text** | `true` `false` | `true`, meaning text is dedented. | Strip common indentation from `/text{}` blocks? |
| **ignore_comments** | `true` `false` | `false`, meaning comments are kept. | Should `%` LaTeX comments be ignored, instead of turned into text expressions (notes)? |
| **ignore_all_blanks** | `true` `false` | `false`, meaning all blank lines are kept. | Should all line breaks be ignored, instead of kept as blank expressions? |
| **keep_leading_blanks** | `true` `false` | `false`, meaning leading blank lines are ignored. | Should trailing blank lines at the start of the source be kept as blank expressions? |
| **keep_trailing_blanks** | `true` `false` | `false`, meaning trailing blank lines are ignored. | Should trailing blank lines at the end of the source be kept as blank expressions? |
| **debug** | `true` `false` | `false`, meaning `compile()` returns `void` | Return debug diagnostics?<br><br>This includes the unevaluated AST and performance diagnostics. |
<!-- autodoc. -->
