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
| **errors** | `"surface"` `"crash"` `"suppress"` | `surface` | How should errors be displayed?<br><br>- `surface` (default): Blocks that result in errors will become Desmos text blocks containing the error message, leaving other expressions unaffected.<br><br>- `crash`: The entire compilation to Desmos will terminate with a single error message in a text block.<br>  - This means you don't get any Desmos rendering at all, but errors are also immediately obvious.<br>   - Note that this will *clear all expressions* in the calculator instance. If you pass in a non-blank `Desmos.Calculator` to `compile()`, it could get cleared.<br><br>- `suppress`: Silently fail on the frontend (if you wish to give the illusion that everything is fine!). |
| **place_errors** | `"inline"` `"end"` `"start"` | `inline` | Where should errors be placed?<br><br>- `inline` (default): Alongside or in place of the expression that produced it.<br>- `end`: All aggregated at the end of the Desmos expressions list.<br>- `start`: All aggregated at the start of the Desmos expressions list. |
| **error_prefix** | `string` | [DESMOST ERROR]. | The prefix to prepend to error blocks.<br><br>Provide a `""` blank string if you wish for no prefix to be added. |
| **expand_errors** | `true` `false` | `true` – all output is shown. | Show all the available diagnostics for errors, including hints and debug information? |
| **check_args** | `true` `false` | `true` – arguments are checked. | Error if an incantation receives a `{}` object argument with unknown fields, or no fields at all?<br><br>For instance, `/label{position: LEFT}` is invalid; it should be `/label{pos: LEFT}`. With `check_args: false`, this silently no-ops.<br><br>Desmost doesn’t remove unknown fields, it just passes them directly to the Desmos API. If you know what you’re doing and a field you know exists isn’t supported by Desmos, you can disable this to avoid erroring. The Desmos API happily accepts and ignores invalid fields, so Desmost provides a safety net for you ;) |
| **prettify** | `true` `false` | `true` – LaTeX is prettified. | Prettify LaTeX output so it renders nicely in the Desmos editor?<br><br>This means you can keep your source code much neater. It handles stuff like converting `()` –> `\left(\right)`, `x, y` –> `x,\ y`, `min(x, y)` –> `\operatorname{min}\left(x,\ y\right)`, and more! |
| **dedent_text** | `true` `false` | `true` – text is dedented. | Strip common indentation from `/text{}` blocks?<br><br>This allows you to indent content for readability:<br><br>```hs<br>/text{<br>  Now I have<br>  a lovely indent<br>}<br>``` |
| **ignore_comments** | `true` `false` | `false` – comments are kept. | Should `%` LaTeX comments be ignored, instead of turned into text blocks (notes)?<br><br>```hs<br>% Do I become a text expression?<br>y = x<br>``` |
| **ignore_all_blanks** | `true` `false` | `false` – blank lines are recognised. | Should all line breaks be ignored, instead of kept as blank expressions?<br><br>```hs<br>% Should there be a blank block after this?<br><br>% Should there be a blank block before this?<br>```<br><br>This takes precedence over `keep_leading_blanks` and `keep_trailing_blanks`. |
| **keep_leading_blanks** | `true` `false` | `false` – leading blank lines are ignored. | Should trailing blank lines at the start of the source be kept as blank expressions?<br><br>This is disabled by default so line breaks after global incantations don’t mess things up:<br><br>```hs<br>/viewport{left: -8, right: 8}<br><br>% I don’t have a blank block above me, yay<br>``` |
| **keep_trailing_blanks** | `true` `false` | `false` – trailing blank lines are ignored. | Should trailing blank lines at the end of the source be kept as blank expressions? |
| **debug** | `true` `false` | `false` – `compile()` returns `void` | Return debug diagnostics from `compile()`?<br><br>This includes the unevaluated AST and performance diagnostics. Relevant types are exposed from `desmost/internal`, but beware that these are implementation details and unstable. |
<!-- autodoc. -->
