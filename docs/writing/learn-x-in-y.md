# Learn X in Y Minutes, where X = Desmost

> [!Note]
> This is a lightning-quick, bare-necessities tour of Desmost syntax.

Desmost is a simple, tiny, lightweight form of line-based LaTeX that compiles to a Desmos graphing calculator instance.

Access Desmos specialties using `/incantation`s (mirroring LaTeX’s `\commands`).

```hs
-- These blocks will be plotted in Desmos.
y = x^2
y = x^3 - 1

-- Any LaTeX is accepted.
y = \int_{0}^{2\pi} e^x \sin{x} \ dx

-- LaTeX comments become Desmos text expressions (“Add Note” in the GUI).
% This is a sine wave.
y = \sin(x)


-- To change how blocks are compiled, we invoke 'incantations'.
-- Incantations start with a / slash and are separated from actual LaTeX with :: double colons
/hide :: y = x^2 - 3x + 4
  -- Won't be rendered in Desmos

/anim :: p = 1
  -- Animates the slider of a variable


-- Some incantations can accept an argument with additional options, enclosed in {} curly braces.
/label{ Origin } :: (0, 0)
  -- This point gets labelled "Origin"

-- Arguments are either a single unquoted string, or a JavaScript object
/slider{ min: -1, max: 1 } :: t = 0
  -- Sets slider bounds of t

-- Incantations and their arguments almost always have an identical interface to the actual Desmos API.
-- However, Desmost also provides a few useful pre-configured incantations with sensible defaults.
y = \frac{1}{x}
/asympt :: x = 0
/asympt :: y = 0
  -- Rendered as dotted lines with lower opacity!


-- We can, naturally, stack multiple incantations in one block.
/anim /slider{ min: 0, max: 1 } :: T = 0

-- To improve readability, we can break a block over multiple lines.
/anim /slider{ min: 0, max: 1 }
  :: T = 0

-- or further:
/anim
/slider{ min: 0, max: 1 }
  :: T = 0

-- or even further:
/anim
/slider{
  min: 0,
  max: 1,
}
  :: T = 0


-- So far, we've been using 'local' incantations.
-- To modify the entire calculator's state, we use 'global' incantations.
/dark
  -- Enables dark mode for the calculator

-- They look and work identically to local incantations, except they don't need to have :: and LaTeX following them.
/viewport{
  left: -5, right: 5,
  bottom: -5, top : 5,
}
  -- Sets the graph bounds


-- We might also want to produce blocks other than LaTeX.
-- ofc, we achieve this through more incantations!

/text{ Desmos(t) is awesome! }
  -- Produces a text block ("Add Note" in Desmos)

-- Write LaTeX over multiple lines
/latex{
  \int
    \frac{1}{x}
    \left(1 + \ln{x}\right)
  \ dx
}

-- These are called 'block' incantations.
-- More might be added in the future for tables, folders, etc.!
```

Putting it all together, here's what a full Desmost 'program' might look like:

```hs
/desmos{
  expressions: true,
  settingsMenu: false,
}
/viewport{
  left: -8, right: 8,
}

/text{
Definite Integral Calculator
v1.0
}

% Enter your integrand here:
/colour{ BLUE } :: f(x) =

% Enter your integration bounds here:
a = 0
b = 1

/text{ Your answer is: }
\int_{a}^{b} f(x) \ dx

/secret
/colour{ BLUE }
/no-line
/fill{ opacity: 0.2 }
  :: /latex{
    min(0, f(x))
    \leq y
    \leq max(0, f(x))
  }
```

btw, you can see this example for yourself in [Playground](https://sup2point0.github.io/desmost).

And that's all there is to Desmost!

For a complete list of all the available incantations, head to [Incantations Reference](incantations-reference.md).
