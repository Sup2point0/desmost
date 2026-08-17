# Compiling

Desmost's primary export is the `compile()` function. Use it like so:

```ts
import { compile } from "desmost";

let calc = Desmos.GraphingCalculator();
compile(calc, `f(x) = x*2`);
```

This parses and evaluates the given Desmost source code, and injects the results into an *existing* Desmos calculator instance from the [Desmos API<sup>↗</sup>](https://www.desmos.com/api/v1.12/docs/index.html).

> [!Important]
> Desmost only works **in the browser**, because it relies on the Desmos API which (currently) can only be included via `<script>`.


## Options

You may wish to customise compilation to suit your needs. See [Compiler Options](compiler-options.md).
