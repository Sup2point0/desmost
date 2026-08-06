# Learn X in Y Minutes, where X = Desmost

Desmost is a simple, tiny, lightweight form of line-based LaTeX that compiles to a Desmos graphing calculator instance.

Desmos specialties are accessed via ***invocations***, which begin with a `/` (mirroring LaTeX’s `\backslash` commands).

Desmost works in blocks, which are usually single lines, but can be expanded with the `/block` incantation.

```hs
-- This block will be plotted in Desmos.
y = x^2

-- Any LaTeX is accepted, provided it stays on a single line.
y = \int_{0}^{2\pi} e^x \sin{x} \ dx


-- To change how blocks are compiled, we invoke 'incantations'.
-- Incantations start with a / spash and are separated from actual LaTeX with :: double colons
/hide :: y = x^2 - 3x + 4  -- This block won't be rendered in Desmos

-- This incantation animates the slider of a variable.
/anim :: p = 1

-- This incantation produces a Desmos text block ("Add Note" in the GUI).
/text :: Desmos(t) is awesome!


-- Some incantations can accept an argument with additional options, enclosed in {} curly braces.
/label{ Origin } :: (0, 0)  -- This point gets labelled "Origin"

-- Arguments are either a single unquoted string, or JavaScript object-like syntax
/slider{ min: -1, max: 1 } :: t = 0  -- Sets slider bounds of t

-- Incantations and their arguments almost always have an identical interface to the actual Desmos API.
-- However, Desmost also provides a few useful pre-configured incantations, with sensible defaults.
y = \frac{1}{x}
/asympt :: x = 0  -- These lines are rendered
/asympt :: y = 0  -- as dotted with lower opacity!


-- We can, naturally, stack multiple incantations on one line!
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

-- The only requirement is that :: must be on the last line of the block, otherwise Desmost will think this block's ended early


-- So far, we've been using 'local' incantations.
-- To modify the entire calculator's state, we use 'global' incantations.
/dark  -- Enable dark mode for the calculator

-- They look and work identically to local incantations, except they don't need to have LaTeX following them.
/viewport{
  left: -5, right: 5,
  bottom: -5, top : 5,
}  -- Sets the graph bounds
```
