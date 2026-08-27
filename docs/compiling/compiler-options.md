# Compiler Options

Desmost provides many options to customise how it compiles your source code.

To configure options, pass in a `DesmostOptions` object when calling `compile()`:

```ts
compile(calc, source, {
  errors: "crash",
  ignore_comments: true,
});
```

Options configure things like error handling, checks and formatting. All settings are optional with sensible defaults that should cover most use cases.

> [!Note]
> The rest of these docs is auto-generated directly from [`options.ts`](../../desmost/src/compiler/options.ts) in the source code, so they’re always up-to-date!


<br>


## Overview

<!-- autodoc? (1) -->
| Option | Values | Default | Description |
| :----- | :----- | :------ | :---------- |
| **errors** | `"surface"` `"crash"` `"suppress"` | `surface` | How should errors be displayed? |
| **place_errors** | `"inline"` `"end"` `"start"` | `inline` | Where should errors be placed? |
| **error_prefix** | `string` | [DESMOST ERROR]. | The prefix to prepend to error blocks. |
| **expand_errors** | `true` `false` | `true` – all output is shown. | Show all the available diagnostics for errors, including hints and debug information? |
| **check_args** | `true` `false` | `true` – arguments are checked. | Error if an incantation receives a `{}` object argument with unknown fields, or no fields at all? |
| **prettify** | `true` `false` | `true` – LaTeX is prettified. | Prettify LaTeX output so it renders nicely in the Desmos editor? |
| **dedent_text** | `true` `false` | `true` – text is dedented. | Strip common indentation from `/text{}` blocks? |
| **ignore_comments** | `true` `false` | `false` – comments are kept. | Should `%` LaTeX comments be ignored, instead of turned into text blocks (notes)? |
| **ignore_all_blanks** | `true` `false` | `false` – blank lines are recognised. | Should all line breaks be ignored, instead of kept as blank expressions? |
| **keep_leading_blanks** | `true` `false` | `false` – leading blank lines are ignored. | Should trailing blank lines at the start of the source be kept as blank expressions? |
| **keep_trailing_blanks** | `true` `false` | `false` – trailing blank lines are ignored. | Should trailing blank lines at the end of the source be kept as blank expressions? |
| **debug** | `true` `false` | `false` – `compile()` returns `void` | Return debug diagnostics from `compile()`? |
<!-- autodoc. (1) -->


<br>


## Options

<!-- autodoc? (2) -->

### `errors`

> Default: `surface`

How should errors be displayed?

- `surface` (default): Blocks that result in errors will become Desmos text blocks containing the error message, leaving other expressions unaffected.

- `crash`: The entire compilation to Desmos will terminate with a single error message in a text block.
  - This means you don't get any Desmos rendering at all, but errors are also immediately obvious.
   - Note that this will *clear all expressions* in the calculator instance. If you pass in a non-blank `Desmos.Calculator` to `compile()`, it could get cleared.

- `suppress`: Silently fail on the frontend (if you wish to give the illusion that everything is fine!).


<br>


### `place_errors`

> Default: `inline`

Where should errors be placed?

- `inline` (default): Alongside or in place of the expression that produced it.
- `end`: All aggregated at the end of the Desmos expressions list.
- `start`: All aggregated at the start of the Desmos expressions list.


<br>


### `error_prefix`

> Default: [DESMOST ERROR].

The prefix to prepend to error blocks.

Provide a `""` blank string if you wish for no prefix to be added.


<br>


### `expand_errors`

> Default: `true` – all output is shown.

Show all the available diagnostics for errors, including hints and debug information?


<br>


### `check_args`

> Default: `true` – arguments are checked.

Error if an incantation receives a `{}` object argument with unknown fields, or no fields at all?

For instance, `/label{position: LEFT}` is invalid; it should be `/label{pos: LEFT}`. With `check_args: false`, this silently no-ops.

Desmost doesn’t remove unknown fields, it just passes them directly to the Desmos API. If you know what you’re doing and a field you know exists isn’t supported by Desmos, you can disable this to avoid erroring. The Desmos API happily accepts and ignores invalid fields, so Desmost provides a safety net for you ;)


<br>


### `prettify`

> Default: `true` – LaTeX is prettified.

Prettify LaTeX output so it renders nicely in the Desmos editor?

This means you can keep your source code much neater. It handles stuff like converting `()` –> `\left(\right)`, `x, y` –> `x,\ y`, `min(x, y)` –> `\operatorname{min}\left(x,\ y\right)`, and more!


<br>


### `dedent_text`

> Default: `true` – text is dedented.

Strip common indentation from `/text{}` blocks?

This allows you to indent content for readability:

```hs
/text{
  Now I have
  a lovely indent
}
```


<br>


### `ignore_comments`

> Default: `false` – comments are kept.

Should `%` LaTeX comments be ignored, instead of turned into text blocks (notes)?

```hs
% Do I become a text expression?
y = x
```


<br>


### `ignore_all_blanks`

> Default: `false` – blank lines are recognised.

Should all line breaks be ignored, instead of kept as blank expressions?

```hs
% Should there be a blank block after this?

% Should there be a blank block before this?
```

This takes precedence over `keep_leading_blanks` and `keep_trailing_blanks`.


<br>


### `keep_leading_blanks`

> Default: `false` – leading blank lines are ignored.

Should trailing blank lines at the start of the source be kept as blank expressions?

This is disabled by default so line breaks after global incantations don’t mess things up:

```hs
/viewport{left: -8, right: 8}

% I don’t have a blank block above me, yay
```


<br>


### `keep_trailing_blanks`

> Default: `false` – trailing blank lines are ignored.

Should trailing blank lines at the end of the source be kept as blank expressions?


<br>


### `debug`

> Default: `false` – `compile()` returns `void`

Return debug diagnostics from `compile()`?

This includes the unevaluated AST and performance diagnostics. Relevant types are exposed from `desmost/internal`, but beware that these are implementation details and unstable.


<br>


<!-- autodoc. (2) -->
