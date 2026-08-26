# Common Pitfalls

For the most part, Desmost is designed to work effortlessly and exactly as you might expect.

Nevertheless, you of course may encounter errors or difficulties. This page covers some common misconceptions or slips that might have caused that!


### Remember the separator
```hs
-- incorrect
/slider{step: 1} A = 0

-- correct
/slider{step: 1} :: A = 0
```

The separator helps Desmost determine where [local incantations](incantations.md#local-incantations) end and expression content starts.

### Some incantations only work on specific expression types
`/hide :: /text{}` doesn’t work, because text expressions have nothing to render anyway. You can only `/hide` a LaTeX expression, like $y = x^2$.
