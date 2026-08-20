# Changelog


## Next (v0.7)

### New
- `/note` alias for `/text`[^note]

[^note]: I’ve caught myself using `/note` instead of `/text` far too many times, so at this point I think it’s worth adding in the alias :P


<br>


## v0.6

### Breaking
- `<Desmost>` requires single `options` object, instead of unpacking into individual fields:

```svelte
<!-- old -->
<Desmost errors="crash" >
```

> This avoids confusion between compile options vs other Svelte parameters, and also avoids polluting the props with a huge (and growing) number of compile options.

### New
- `<Desmost settings={}>` field for setting global Desmos defaults
- `<Desmost lazy>` tag for lazily compiling Desmost blocks using `IntersectionObserver`


<br>


## v0.5.5

### Fixes
- `<Desmost>` styles apply properly without `style` overriding `width` and `height`


<br>


## v0.5.4

### Fixes
- Apply `<Desmost>` styles to correct element


<br>


## v0.5.3

### Fixes
- Fix compilation issues in `<Desmost>`


<br>


## v0.5.2

### Fixes
- The `desmost/svelte` subpackage files weren’t being published!


<br>


## v0.5.1

### Fixes
- Implement `ignore_comments` compile option
- Disallow `%` LaTeX comments after local incantations
- `prettify` replaces all sequences of >1 whitespace characters with a singular ` ` space


<br>


## v0.5

### New
- `desmost/svelte` subpackage providing the `<Desmost>` Svelte component
- Compile `% sup, world` LaTeX comments into Desmos text expressions


<br>


## v0.4.1

### Fixes
- Avoid assignments to passed in `DesmostOptions` object which might affect externals


<br>


## v0.4

### New
- `ignore_blank_lines` compile option to strip all blank expressions from Desmos output
- Object arguments to incantations can now use unquoted enum literals, like `/line{ style: DOTTED }` instead of `/line{ style: "DOTTED" }`

### Fixes
- Format parser crash error messages properly


<br>


## v0.3.2

### Fixes
- Tighten publish pipeline to avoid stale builds being published


<br>


## v0.3.1

### Fixes
- Fix `\{\}` prettification (thanks [@iTechnical](https://github.com/itechnicals)!)


<br>


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


<br>


## v0.1.1

### New
- Expose `desmost/internal` namespace for reaching into compiler internals, such as `Ast` types

### Fixes
- Add explicit file extensions to compiled files for end users without bundlers


<br>


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
