# Incantations

***Incantations*** are the core feature of Desmost syntax. They’re what provides access to Desmos’s features and functionality, like styling how graphs are rendered and changing the calculator settings.


<br>


## Syntax

Incantations look like this:

```hs
/dark-mode
/latex{y = x}

/hide :: y = x
/label{text: "sup"} :: (0, 0)
```

They consist of a `/` slash followed by an *identifier*. Certain incantations also accept an *argument*, enclosed in `{}` braces.

> [!Note]
> Look familiar? This is the same syntax as LaTeX’s `\command{}`s, but with the backslash mirrored![^backslash]

[^backslash]: When developing the original rudimentary hacked-together origin of Desmost in [*Integrity*](https://github.com/Sup2point0/integrity), I opted for forward slashes to avoid confusion with LaTeX ;)


<br>


## Incantation Types

Incantations come in 3 flavours: ***expression***, ***global***, and ***local*** incantations. Each has different purposes, but the syntax and principles are all the same.

### Expression Incantations
Expression incantations *produce* one expression.

```hs
/latex{ y = x }
/latex{
  f(x) =
    x^2
}

/text{ This is a text block, }
/text{
Which can
span multiple lines!
}
```

There are currently only 2 expression incantations: `/latex{}` and `/text{}` (more will be added in future). The former produces a LaTeX expression (e.g. a graph, function, variable); the latter produces a text block (“Add Note” in the Desmos UI).

You only need these for multi-line content. (By default, in your source code each line of LaTeX produces a LaTeX expression and comments produce text expressions).

### Global Incantations
Global incantations modify the global state of the calculator. For instance, `/dark` enables dark mode.

```hs
/dark
/desmos{keypad: false}
/viewport{left: -8, right: 8}
```

Global incantations don’t produce or affect any expressions. You can only invoke 1 global incantation per block. You can use them anywhere in your source (although placing them all at the start probably makes the most sense).

> [!Tip]
> `keep_leading_blanks` is disabled by default, so leaving blank lines after global incantations at the start of your source won’t result in blank expressions at the top of your Desmos calculator.

### Local Incantations
Local incantations *modify* one expression. For instance, `/hide` disables rendering for a block.

```latex
% This won’t be shown
/hide :: y = x
```

Local incantations come before the expression, followed by a `::` separator.

A block can have any number of local incantations, although you’ll rarely need more than 1 or 2.

```hs
/no-line /colour{BLUE} :: y \leq x^2
```


<br>


## Incantation Arguments

Incantations may accept an argument providing additional data. For instance, `/colour` needs to know what colour you want to use!

> TODO


<br>


## Argument Types

> TODO

### Object
```hs
/incantation{field: value, field: value}
```

Incantations with multiple settings accept a JavaScript object as their argument. The fields are (almost always) mirrored with the Desmos API – for instance, in the API to create a slider you would do:

```ts
calc.setExpression({ latex: "t = 0", sliderBounds: { min: -1, max: 1 }});
```

In Desmost:

```hs
/slider{min: -1, max: 1} :: t = 0
```


<br>
