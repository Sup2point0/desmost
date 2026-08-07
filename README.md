# Desmost

<div align="center">

[Docs](docs/) · Walkthrough · [Spec](docs/grammar.md) · Playground

</div>

> [!Warning]
> I’ve only just started developing this project, it’s not quite presentable yet!

***Desmost*** compiles LaTeX into Desmos. You write this:

```hs
/viewport{ left: -5, right: 5 }

A = 1
y = A \sin(x - t)

/label{ text: "Desmos(t) is awesome!" }
  :: (0, 2)

/animate /slider{ min: -1, max: 1 }
  :: t = 0
```

and Desmost gives you this:

![“Desmos(t) is awesome!”, but in a fully-fledged Desmos graphing calculator embed](.assets/)

In other words, it’s like HTML+CSS, but for Desmos. Write your content in LaTeX (alongside your Markdown!), and Desmost will produce the Desmos calculator for you.

This repository implements the Desmost ‘compiler’, which parses your source text, and injects the results into a `Desmos.Calculator` instance via the Desmos API. How you use the compiler, and render the end result, is left up to you!


## Usage

> [!Important]
> This is how it *will* work, it doesn’t work yet!

> [!Tip]
> Head to [Walkthrough](docs/readme.md) for a complete walkthrough on how to use Desmost end-to-end.

### Install
```bash
npm install --save desmost
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
  errors: "hide",
});
```

### Svelte + MDsveX
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
<Desmost height="90vh" errors="fail">
  <Content />
</Desmost>
```


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

All you need to do is add `/animate` in front of that line:

```hs
/animate :: a = 2
b = 3
c = 5

y = ax^2 + bx + c
```

Easy, innit? These are called ***incantations***, and it’s the only syntax there is in Desmost (told you it was a tiny DSL).

> [!Tip]
> `::` is the delimiter for separating Desmost incantations from actual LaTeX.

When Desmost compiles this into Desmos, it’ll see `/animate` and know to set `playing: true` for that particular Desmos expression.

### Scalable
Suppose you also want to customise the slider bounds. Just add another incantation, this time with an argument:

```hs
/animate /slider{ min: 0, max: 10 } :: a = 2
b = 3
c = 5

y = ax^2 + bx + c
```

### Readable
This line is getting a little long, though. We can break it up over multiple lines, provided we keep the `::` on the last line:

```hs
/animate
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

```
/latex{
  I = \int \frac
      {1 + x + x^2}
      {1 + x}
    \ dx
}
```

And that’s all there is to Desmost!

### Future
- Reversed Syntax
- Desmos -> Desmost
- Folders
- Tables


## Rationale

### Made for Markdown
Desmost doesn’t have to be used for Markdown, but that’s what it was designed for.[^made-for-md] The key purpose of Desmost is to let you program Desmos embeds **with raw text** *alongside your prose*:

[^made-for-md]: I mean, if you aren’t using Desmost in Markdown, then you may as well just use the Desmos JavaScript API directly.

```md
# Mysteries of Sound

Today we’re investigating the beauty of soundwaves and Fourier transforms. This is a sine wave:

\```desmos
y = \sin{x}
```

And here’s a saw wave:

\```desmos
/viewport{ left: -2*Math.PI, right: 2*Math.PI }

/slider{ min: 1, max: 40, step: 1 } :: N = 1
/latex{
  f(x) = \frac{2}{\pi} \sum_{n=0}^{N} \frac{
}

/anim-mono /slider{ min: 0, max: "2\\pi" }
\```
```

Exactly like how a `math` code block renders into LaTeX, or a `mermaid` code block renders a diagram.

### Keep the simple stuff simple
We want simple stuff like this to work effortlessly:

```math
p = 2
q = 3
p + q
```

It’s almost like you meant to type this into Desmos, but accidentally typed it into Notepad instead.

### Mirror the Desmos API

### Don’t parse LaTeX
Desmost only handles what it needs to care about to work. You don’t need a LaTeX parser, because Desmos will already do that later down the line – parsing it ourselves would just be wasted effort!
