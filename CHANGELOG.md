# Changelog


## Next (v0.2.0)

### Fixes
- Refactor internals to avoid costly exceptions, for significant performance gains!
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
