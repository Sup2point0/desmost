# Rationale

This document explains the rationale behind Desmost’s existence, design decisions and future aims.


<br>


## What’s this for?

I have a lot of sites ([*Integrity*], [*Awxynth*]) where I have articles written in Markdown, and I want to add Desmos embeds in them.

```md
Let’s illustrate this with a Desmos graph.

<!-- what now? -->
```

A code block with the Desmos source is almost certainly the best way to do this.[^alt-text][^js]

[^alt-text]: You even get alt text for free!
[^js]: MDsveX allows inline Svelte or JS, but the key thing is that *this is messy and overkill*. I want to keep the source clean, readable and *still renderable* with a normal Markdown renderer.

```md
Let’s illustrate this with a Desmos graph.

\```desmos
y = \sin(x)
\```
```

Since the Desmos API just consumes raw LaTeX, all I have to on the frontend is find all these ` ```desmos ` blocks, split them on `\n` to get my lines, and then use `calculator.setExpression()` to inject them into a Desmos embed. Great!

However, Desmos is more than just lines of LaTeX! What about notes? Hiding graphs? Colours? Slider bounds? Viewport bounds?

These are Desmos specialities that can’t be conveyed through LaTeX. They’re all configured by different fields in the Desmos API. I needed a syntax for controlling these extraneous aspects – and this is how Desmost was born!

```hs
/colour{BLUE} :: y = x
```


<br>


## Future

Desmost is, for the most part, already perfectly usable. From here, there’s not much to *add*, it’s mostly just things to *improve* – making the experience better, more reliable, and more customisable.

### What Desmost Is
- A thin DSL wrapper for the actual Desmos API
- Minimal, lightweight, *readable* syntactic sugar

### What Desmost Is Not
- A programming language
- A scripting language
- A Desmos ‘editor’

I have no plans to introduce way too complex features like variables, loops, conditional compilation. It’s too much; Desmost is just humble markup! Do that stuff in *Desmos* if you need to.
