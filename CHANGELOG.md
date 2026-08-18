# Changelog


## Next (v0.5.1)

### Fixes
- Implement `ignore_comments` compile option
- Disallow `%` LaTeX comments after local incantations


## v0.5

### New
- `desmost/svelte` subpackage providing the `<Desmost>` Svelte component
- Compile `% sup, world` LaTeX comments into Desmos text expressions


## v0.4.1

### New
- Expose `DesmostDebug` from `desmost/internal`

### Fixes
- Avoid assignments to passed in `DesmostOptions` object which might affect externals


## v0.4

### New
- `ignore_blank_lines` compile option to strip all blank expressions from Desmos output
- Object arguments to incantations can now use unquoted enum literals, like `/line{ style: DOTTED }` instead of `/line{ style: "DOTTED" }`

### Fixes
- Format parser crash error messages properly


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
- `/colour`/`/color`
- `/dashed`
- `/fill`
- `/hide`
- `/line`
- `/no-line`
- `/point`
- `/secret`
- `/slider`
