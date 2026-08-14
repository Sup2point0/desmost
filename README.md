<div align="center">

# Desmost

[**Docs**](docs/)&ensp;·&ensp;[**Learn X in Y**](docs/writing/learn-x-in-y.md)&ensp;·&ensp;[**Spec**](docs/spec/)&ensp;·&ensp;[**Playground**](https://sup2point0.github.io/desmost)

[![npm](https://img.shields.io/npm/v/desmost?color=c93ff5)](https://www.npmjs.com/package/desmost)
[![test](https://github.com/Sup2point0/desmost/actions/workflows/test.yml/badge.svg)](https://github.com/Sup2point0/desmost/actions/workflows/test.yml)
[![autodoc](https://github.com/Sup2point0/desmost/actions/workflows/autodoc.yml/badge.svg)](https://github.com/Sup2point0/desmost/actions/workflows/autodoc.yml)
[![site](https://github.com/Sup2point0/desmost/actions/workflows/deploy.yml/badge.svg)](https://github.com/Sup2point0/desmost/actions/workflows/deploy.yml)

</div>

> [!Warning]
> I’ve only just started developing this project, so it’s not quite presentable yet!

***Desmost*** compiles LaTeX into Desmos.

<table>
  <tr></tr>
  <tr>
    <th> You write this: </th>
    <th> and Desmost gives you this: </th>
  </tr>
  <tr>
    <td>
      <pre lang="hs"><code>
/viewport{ left: -5, right: 5 }
<br>
% Drag the slider!
A = 1
y = A \sin(x - t)
<br>
/label{ text: "we love Desmos(t)!" } :: (0, 2)
<br>
/anim /slider{ min: -1, max: 1 }
  :: t = 0
</code></pre>
    </td>
    <td>
      <a href="https://sup2point0.github.io/desmost">
        <img
          src=".assets/"
          alt="“Desmos(t) is awesome!”, but in a fully-fledged Desmos graphing calculator embed"
        />
      </a>
    </td>
  </tr>
</table>

In other words, it’s like HTML+CSS but for Desmos. Write your content in LaTeX (alongside your Markdown!) with a touch of Desmost magic, and Desmost will turn it to a Desmos calculator embed for you.


<br>


## Directory

| Folder | Description |
| :----- | :---------- |
| [`desmost/`](desmost/) | The Desmost compiler, which parses and evaluates your source code, then injects the results into a `Desmos.Calculator` instance via the Desmos API. How you use the compiler and render the end result, is left up to you! |
| [`playground/`](playground/) | The Desmost site, with the interactive live-compile playground. |
| [`docs/`](docs/) | All the information you need for how to write and use Desmost. |


<br>


## Usage

> [!Important]
> Desmost only works **in the browser**. This is because the Desmos API (currently) can only be included via `<script>`.

### Install
```bash
npm install desmost
```

### Write
See [Docs / Writing](docs/writing) guidance on Desmost syntax.

### Compile
```ts
import { compile } from "desmost";

let calc = Desmos.GraphingCalculator(...);
compile(calc, "f(x) = x^2");
```

Pass in options to customise the compilation:

```ts
compile(calc, "/text{ sup world! }", {
  errors: "crash",
  keep_line_breaks: false,
});
```

See [Docs / Compiling / Options](docs/compiling/compiler-options.md) for a reference of the available options.

### Render
Up to you, in your framework of choice!

Or, if you enjoy nice things, Desmost provides a [Svelte](https://svelte.dev) component for mass-compiling ` ```desmos ` blocks in [MDsveX](https://github.com/pngwn/mdsvex) content:

```svelte
<script>
  import Content from "./intro.md";

  import { Desmost } from "desmost/svelte";
</script>

<Desmost>
  <Content />
</Desmost>
```

Pass compilation options directly to the component:

```svelte
<Desmost errors="crash">
  <Content />
</Desmost>
```

You can customise rendering, too:

```svelte
<Desmost lazy height="90vh">
  <Content />
</Desmost>
```


<br>


## Features

> [!Tip]
> This is a brief look at what Desmost can do, and why you might want to use it. For full guidance, please head to [Docs](docs/)!

### Simple
Desmost aims to be as lightweight as possible. If all you need is a blocks of LaTeX with no extra customisation, then **that’s all you need to write**.

```hs
a = 2
b = 3
c = 5

y = ax^2 + bx + c
```

### Intuitive
But let’s say you want to animate the slider for one of those variables in Desmos.

All you need to do is add `/anim` in front of that line, plus a `::` delimiter:

```hs
/anim :: a = 2
b = 3
c = 5

y = ax^2 + bx + c
```

These are called ***incantations***, and it’s the only syntax there is in Desmost.[^tiny]

[^tiny]: Told you Desmost’s a tiny DSL!

When Desmost compiles this into Desmos, it’ll see `/anim` and know to set `playing: true` for that particular Desmos expression.

### Scalable
Suppose you also want to customise the slider bounds. Just add another incantation, this time with an argument:

```hs
/anim /slider{ min: 0, max: 10 } :: a = 2
b = 3
c = 5

y = ax^2 + bx + c
```

> [!Tip]
> Look familiar? Desmost’s incantation syntax mirrors LaTeX’s `\backslash{}` commands ;)

### Readable
This line is getting a little long, though. We can break it up over multiple lines:

```hs
/anim
/slider{ min: 0, max: 10 }
  :: a = 2
b = 3
c = 5

y = ax^2 + bx + c
```

### Multi-Line LaTeX
What if it’s not your incantations, but your LaTeX that’s becoming too long?

```hs
I = \int \frac{1 + x + x^2}{1 + x} \ dx
```

We’ve got an incantation for that – `/latex`:

```hs
/latex{
  I = \int \frac
      {1 + x + x^2}
      {1 + x}
    \ dx
}
```

### Notes
You’ll no doubt want to add text expressions to your Desmos at some point. You can either use the `/text{}` incantation:

```latex
/text{ The normalised Gaussian. }
f(x) = \frac{1}{\sqrt{2\pi}} e^{-\frac{1}{2}x^2}
```

or, if you want to lean into pure LaTeX more, just leave a LaTeX comment:

```latex
% The normalised Gaussian.
f(x) = \frac{1}{\sqrt{2\pi}} e^{-\frac{1}{2}x^2}
```

And that’s all there is to Desmost!

All other functionality you might need is accessed through more incantations. For a complete list of all the available incantations, visit [Incantations Reference](docs/incantations.md).

Enjoy!


<br>


## Rationale

### Made for Markdown
Desmost doesn’t have to be used for Markdown, but that’s what it was designed for.[^made-for-md] The key purpose of Desmost is to let you program Desmos embeds **with raw text** *alongside your prose*:

[^made-for-md]: I mean, if you aren’t using Desmost in Markdown, then you may as well just use the Desmos JavaScript API directly.

````md
# Mysteries of Sound

Today we’re investigating the beauty of soundwaves and Fourier transforms. This is a sine wave:

```desmos
y = \sin{x}
```

And here’s a saw wave:

```desmos
/viewport{ left: -2*Math.PI, right: 2*Math.PI }

/slider{ min: 1, max: 40, step: 1 } :: N = 1
/latex{
  f(x) = \frac{2}{\pi} \sum_{n=0}^{N} \frac{
}

/anim-mono /slider{ min: 0, max: "2\\pi" }
```
````

Exactly like how a ` ```math ` code block renders into LaTeX, or a ` ```mermaid ` code block renders a diagram.

### Keep the simple stuff simple
We want simple stuff like this to work effortlessly:

```math
p = 2
q = 3
p + q
```

This keeps it easily comprehendable when mixed with Markdown. And it’s exactly the same as what you’d type into Desmos – it’s like you meant to, but accidentally ended up typing it into your IDE!

### Make the complex stuff possible
At the same time, we want to provide full control over as many aspects of the calculator as possible. Incantations make this easy – to access more functionality, all it takes is adding a new incantation.

### Mirror the Desmos API
All object arguments to incantations such as `/viewport{}` and `/slider{}` are identical to the Desmos API. This means fewer unnecessary abstractions for you to remember.

### Don’t parse LaTeX
Desmost only handles what it needs to care about to work. You don’t need a LaTeX parser, because Desmos will already do that later down the line – parsing it ourselves would just be wasted effort!


<br>


## Generative AI

<a href="https://brainmade.org">
  <img align="right" height="40" src=".assets/brainmade-black.svg" />
</a>

Every bug, typo and inefficiency was lovingly crafted by hand :D


<br>
