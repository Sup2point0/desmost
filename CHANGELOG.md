# Changelog


<br>


## v0.9

### Breaking
- Decompiler moved to `desmost/decompiler` scope (was `desmost`)
- Update `@types/desmos` peer dependency `1.11` -> `1.12`

### New
- `/text{}` strips common indentation, allowing you to indent your text nicely:

```hs
-- before
/text{
this
is kinda ugly
}

-- now
/text{
  much
  better!
}
```

- `dedent_text` compile option to opt out of the above

### Fixes
- Prettify handles whitespace between `\left (` (previously it only handled `\left(`)
- `<Desmos>` checks `isIntersecting` before compiling
- Decompiler emits `% ...` for single-line notes, and better formatted `/text{ ... }` for multi-line notes
- Decompiler rejects tables with `[tables are currently unsupported]` instead of `?`
- Decompiler rejects other expressions with `[unsupported]` instead of `?`


<br>


## v0.8.2

### New
- Prettification handles `length()`, `and`, `or` Desmos keywords


## v0.8.1

### New
- `sideEffects: false` in `package.json` to help bundlers tree-shake

### Fixes
- Preserve comments in emitted `.js` so IDEs keep documentation tooltips


## v0.8

### New
- Rudimentary decompiler!
  - `desmost` now exports a `decompile()` function, for turning a `Desmos.Calculator` instance into raw Desmost source code
- `prettify` subtitutes `:`/`,` with `:\\ `/`,\\ ` to add a visual trailing space


<br>


## v0.7.3

### Fixes
- When an error occurs in evaluating an incantation argument, correctly terminate evaluation for that block instead of passing along an invalid argument
- Fix `/viewport` (Desmos API required all 4 fields, so now missing fields are filled in with the existing values)


## v0.7.2

### Fixes
- Handle empty `/latex{}` expressions properly
- Do not call `.updateSettings()` when `/desmos` is invoked without an argument
- Properly disconnect unfired `IntersectionObservers` when unmounting `<Desmost>`


## v0.7.1

### Fixes
- `/label` enables `showLabel: true` by default
- Prettification skips already-prettified `\left\{` and `\right\}`


## v0.7

### Breaking
- Leading and trailing blank lines are ignored by default, instead of kept as blank expressions
- `ignore_trailing_blanks` renamed to `keep_trailing_blanks`
- `ignore_blank_lines` renamed to `ignore_all_blanks`

### New
- `keep_leading_blanks` compile option
- `/note` alias for `/text`[^note]

[^note]: I’ve caught myself using `/note` instead of `/text` far too many times, so at this point I think it’s worth adding in the alias :P

### Fixes
- `compile()` no longer allows non-Desmost exceptions to escape; they will also be injected into Desmos


<br>


## v0.6.1

### Fixes
- Disconnect `IntersectionObserver` in `<Desmost>` to avoid duplicate fires


## v0.6

### Breaking
- `<Desmost>` requires single `options` object, instead of unpacking into individual fields:

```svelte
<!-- old -->
<Desmost errors="crash" keep_trailing_blanks={true} width="90vw" lazy />

<!-- new -->
<Desmost options={{ errors: "crash", keep_trailing_blanks: true }} width="90vw" lazy />
```

> This avoids confusion between compile options vs other Svelte parameters, and also avoids polluting the props with a (increasingly) large number of compile options.

### New
- `<Desmost settings={}>` field for setting global Desmos defaults
- `<Desmost lazy>` tag for lazily compiling Desmost blocks using `IntersectionObserver`


<br>


## v0.5.5

### Fixes
- `<Desmost>` styles apply properly without `style` overriding `width` and `height`


## v0.5.4

### Fixes
- Apply `<Desmost>` styles to correct element


## v0.5.3

### Fixes
- Fix compilation issues in `<Desmost>`


## v0.5.2

### Fixes
- The `desmost/svelte` subpackage files weren’t being published!


## v0.5.1

### Fixes
- Implement `ignore_comments` compile option
- Disallow `%` LaTeX comments after local incantations
- `prettify` replaces all sequences of >1 whitespace characters with a singular ` ` space


## v0.5

### New
- `desmost/svelte` subpackage providing the `<Desmost>` Svelte component
- Compile `% sup, world` LaTeX comments into Desmos text expressions


<br>


## v0.4.1

### Fixes
- Avoid assignments to passed in `DesmostOptions` object which might affect externals


## v0.4

### New
- `ignore_blank_lines` compile option to strip all blank expressions from Desmos output
- Object arguments to incantations can now use unquoted enum literals

```hs
-- before:
/line{style: "DOTTED"} :: y = x

-- now also:
/line{style: DOTTED} :: y = x
```

### Fixes
- Format parser crash error messages properly


<br>


## v0.3.2

### Fixes
- Tighten publish pipeline to avoid stale builds being published


## v0.3.1

### Fixes
- Fix `\{\}` prettification (thanks [@iTechnical](https://github.com/itechnicals)!)


## v0.3

### New
- `prettify` compile option to prettify LaTeX output for Desmos
  - `()`, `[]`, etc. are converted to `\left(\right)`
  - Desmos-only functions like `round()`, `mod()` are converted to `\operatorname{round}()`
  - This means your LaTeX source can be clean, but still render nicely!
- `/label` incantation for adding labels to points


<br>


## v0.2

### New
- `::` now no longer requires the LaTeX to be on the same line, so these are allowed:

```hs
/hide ::
  y = x^2

/hide
::
  y = x^2
```

### Fixes
- Refactor internals to avoid costly exceptions, for significant performance gains!
- Fix balanced string quote matching in arguments, so nested quotes in strings like `"don't"` work properly
- Trim trailing spaces in LaTeX output


<br>


## v0.1.2

### Fixes
- Fix misconfigured TSConfig, which was resulting in files being compiled to `dist/src/` instead of `dist/`


## v0.1.1

### New
- Expose `desmost/internal` namespace for reaching into compiler internals, such as `Ast` types

### Fixes
- Add explicit file extensions to compiled files for end users without bundlers


## v0.1

Initial release on npm!

Available incantations:
- `/latex`
- `/text`
- `/desmos`
- `/viewport`
- `/dark`
- `/anim`
- `/colour` (`/color`)
- `/dashed`
- `/fill`
- `/hide`
- `/line`
- `/no-line`
- `/point`
- `/secret`
- `/slider`


<br>
