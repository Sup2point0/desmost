# Incantations

***Incantations*** are the core feature of Desmost syntax.

They give you access to Desmos’s features beyond what LaTeX can do, like styling how graphs are rendered and changing the calculator settings.

For a complete list of all incantations in Desmost, head to [Incantations Reference](incantations-reference.md).


<br>


## Syntax

Incantations look like this:

```hs
/dark-mode
/text{ this note is too small to contain this proof }

/hide :: y = x
/label{text: "sup"} :: (0, 0)
```

They consist of a `/` slash followed by an *identifier*. Certain incantations also accept an *argument*, enclosed in `{}` braces.

> [!Note]
> Look familiar? Yeah you guessed it, this is the same syntax as LaTeX’s `\command{}`s, but with the backslash mirrored![^backslash]

[^backslash]: When developing the original rudimentary hacked-together origin of Desmost in [*Integrity*](https://github.com/Sup2point0/integrity), I opted for forward slashes to avoid confusion with LaTeX ;)


<br>


## Incantation Types

Incantations come in 3 flavours: ***expression***, ***global***, and ***local*** incantations.

Each achieves different purposes, but the syntax and principles are all the same.

### Expression Incantations
Expression incantations **produce** an *expression*.

```hs
/latex{ y = x }
/latex{
  f(x) =
    x^2
}

/text{ This is a text block, }
/text{
  which can
  span multiple lines!
}
```

There are currently only 2 expression incantations: `/latex{}` and `/text{}`.[^only-two] The former produces a LaTeX expression (e.g. a graph, function, variable); the latter produces a text block (“Add Note” in the Desmos UI).

[^only-two]: I’ll probably add more in future, like `/table` and `/folder`!

Currently, you only need these for multi-line content.

### Global Incantations
Global incantations modify the *global* state of the calculator. For instance, `/dark` enables dark mode.

```hs
/dark
/desmos{keypad: false}
/viewport{left: -8, right: 8}
```

Global incantations don’t produce or affect any expressions. You can only invoke 1 global incantation per block. You can use them anywhere in your source (although placing them all at the start probably makes the most sense).

> [!Tip]
> `keep_leading_blanks` is disabled by default, so leaving blank lines after global incantations at the start of your source won’t result in blank expressions at the top of your Desmos calculator:
>
> ```hs
> /desmos{...}
> /viewport{...}
> 
> % The blank block above isn’t included!
> ```

### Local Incantations
Local incantations *modify* an expression. For instance, `/hide` disables rendering for a block.

```hs
-- This won’t be shown
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

The type of argument required depends on the incantation.

### Object
```hs
/incantation{field: value, field: value}

/viewport{left: -8, right: 8}
```

Incantations with multiple settings accept a JavaScript object as their argument. The vast majority of incantations accept object arguments!

The fields are (almost always) mirrored with the Desmos API – for instance, in the API to create a slider you would do:

```ts
calc.setExpression({ latex: "t = 0", sliderBounds: { min: -1, max: 1 }});
```

In Desmost:

```hs
/slider{min: -1, max: 1} :: t = 0
```

### Enum
```hs
/incantation{enum}

/colour{BLUE}
```

Incantations that pick one value from a closed set accept the name of that value, unquoted.

You can also leave enums unquoted in object arguments; they’ll be handled automatically.

```hs
/label{pos: RIGHT, text: "Woah cool, RIGHT?"}
```


<br>
