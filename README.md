<div align="center">

# Desmost

[Docs](docs/) · [Walkthrough](docs/readme.md) · [Learn X in Y](docs/writing/learn-x-in-y.md) · [Spec](docs/spec/) · [Playground](https://sup2point0.github.io/desmost)

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
A = 1
y = A \sin(x - t)
<br>
/label{ text: "Desmos(t) is awesome!" }
  :: (0, 2)
<br>
/anim /slider{ min: -1, max: 1 }
  :: t = 0</code></pre>
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

In other words, it’s like HTML+CSS, but for Desmos. Write your content in LaTeX (alongside your Markdown!), and Desmost will produce the Desmos calculator for you.


<br>


## Directory

| Folder | Description |
| :----- | :---------- |
| [`desmost/`](desmost/) | The Desmost compiler, which parses and evaluates your source code, then injects the results into a `Desmos.Calculator` instance via the Desmos API. How you use the compiler and render the end result, is left up to you! |
| [`playground/`](playground/) | The Desmost site, with the interactive live-compile playground. |


<br>


## Usage

> [!Tip]
> For an exhaustive walkthrough on how to use Desmost end-to-end, head to [Walkthrough](docs/readme.md).

### Install
```bash
npm install desmost
```

### Write
See [Docs / Writing](docs/writing) to understand how to use Desmost syntax.

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
});
```

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

Pass in options directly to customise compilation:

```svelte
<Desmost height="90vh" errors="crash">
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

All you need to do is add `/anim` in front of that line, with a `::` delimiter:

```hs
/anim :: a = 2
b = 3
c = 5

y = ax^2 + bx + c
```

These are called ***incantations***, and it’s the only syntax there is in Desmost.[^tiny]

[^tiny]: Told you it was a tiny DSL :D

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
> Look familiar? Desmost’s incantation syntax mirrors LaTeX’s `\backslash{}` commands!

### Readable
This line is getting a little long, though. We can break it up over multiple lines:[^multi-line]

[^multi-line]: Caveat – the `::` must be on the last line of the block, since any content on a new line from `::` is parsed as the start of a new block. See [Docs / Writing / Common Pitfalls](docs/writing/common-pitfalls.md).

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

And that’s all there is to Desmost!

All other functionality you might need is accessed through more incantations. For a complete list of all the available incantations, visit [Incantations Reference](docs/incantations.md).


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

Exactly like how a `math` code block renders into LaTeX, or a `mermaid` code block renders a diagram.

### Keep the simple stuff simple
We want simple stuff like this to work effortlessly:

```math
p = 2
q = 3
p + q
```

It’s like you *meant* to type this into Desmos, but accidentally typed it into your IDE instead.

Since the intention is to use Desmost alongside Markdown, we want to keep it clean and readable so that it doesn’t completely dominate other Markdown.

### Mirror the Desmos API
All object arguments to incantations such as `/viewport{}` and `/slider{}` are identical to the Desmos API. This means fewer unnecessary abstractions for you to remember.

### Don’t parse LaTeX
Desmost only handles what it needs to care about to work. You don’t need a LaTeX parser, because Desmos will already do that later down the line – parsing it ourselves would just be wasted effort!


<br>
