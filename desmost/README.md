# Desmost

[**Docs**](https://github.com/Sup2point0/desmost/tree/main/docs) &ensp;·&ensp; [**Changelog**](https://github.com/Sup2point0/desmost/blob/main/CHANGELOG.md) &ensp;·&ensp; [**Learn**](https://github.com/Sup2point0/desmost/blob/main/docs/writing/learn-x-in-y.md) &ensp;·&ensp; [**Playground**](https://sup2point0.github.io/desmost)

A tiny DSL for compiling LaTeX to Desmos.


<br>


<table>
  <tr>
    <th> You write this: </th>
    <th> and Desmost gives you this: </th>
  </tr>
  <tr>
    <td>
      <pre lang="hs"><code>
/viewport{left: -5, right: 5}
<br>
% Drag the slider!
A = 1
f(x) = A \sin(x-t)
<br>
/label{
  text: "we love Desmos(t)!"
} :: (0, f(0))
<br>
/anim
/slider{min: -10, max: 10}
  :: t = 0
</code></pre>
    </td>
    <td>
      <a href="https://sup2point0.github.io/desmost">
        <img
          width="600"
          src=".assets/demo.png"
          alt="“Desmos(t) is awesome!”, but in a fully-fledged Desmos graphing calculator embed"
        />
      </a>
    </td>
  </tr>
</table>

In other words, it’s like HTML+CSS but for Desmos. Write your content in LaTeX (alongside your Markdown!) with Desmost syntax where you need it, and Desmost will turn it into a Desmos calculator embed for you.


<br>


## Requirements

- Desmos API v1.12
- Desmost only works **in the browser**, because the Desmos API can only be included via a `<script>` tag


<br>


## Usage

### Compile
```ts
import { compile } from "desmost";

let calc = Desmos.GraphingCalculator(...);
compile(calc, "f(x) = x^2");
```

Pass in [options](https://github.com/Sup2point0/desmost/blob/main/docs/compiling/compiler-options.md) to customise compilation:

```ts
compile(calc, "/text{ sup world! }", {
  errors: "crash",
  ignore_blank_lines: true,
});
```

### Render
Left up to you, in your framework of choice!

But if you enjoy nice things, Desmost provides a [Svelte<sup>↗</sup>](https://svelte.dev) component for mass-compiling Desmost, intended to be used in conjunction with [MDsveX<sup>↗</sup>](https://mdsvex.pngwn.io/):

```svelte
<script>
  import Content from "./intro.md";
  import { Desmost } from "desmost/svelte";
</script>

<Desmost>
  <Content />
</Desmost>
```

This will replace all ` ```desmos ` blocks from your Markdown source with Desmos calculator embeds.


<br>


<a href="https://brainmade.org">
  <img height="40" src=".assets/brainmade-black.svg" />
</a>
