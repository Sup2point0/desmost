# Changelog


## v0.3.1

### Fixes
- Fix `\{\}` prettification (thanks [@iTechnical](https://github.com/itechnicals)!)


## v0.3.0

### New
- `prettify` compiler option to prettify LaTeX output for Desmos
  - `()`, `[]`, etc. are converted to `\left(\right)`
  - Handles Desmos-only functions like `round()`, `mod()` are converted to `\operatorname{round}()`
  - This means your LaTeX source can be clean, but still render nicely!
- `/label` incantation for adding labels to points


## v0.2.0

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


## v0.1.0

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
