# Walkthrough

This page explains in full detail how Desmost and Desmos fit together.

You don’t need to understand all this to work with Desmost – but it’ll certainly help sink in the intuition!

If you’re interested in a quicker introduction to Desmost, head to [Learn X in Y](learn-x-in-y.md).


<br>


## How does Desmos work?

> Desmost compiles to Desmos, so you’ll certainly need to be familiar with how Desmos works.

The Desmos graphing calculator has 2 parts: on the right, the ***graphing window*** or “viewport”; on the left, the ***expressions list*** or “editor”.[^names]

[^names]: Yeah, the names are not standardised, but luckily they’re pretty clear no matter what you pick. If you’re wondering, the discrepancy is due to differing terms between the user-facing GUI, developer-facing API, and human-facing intuition.

The editor contains 1 or more ***blocks*** or ***expressions*** (we’ use these terms interchangeably[^blocks-exprs]). By default, blocks contain a line of LaTeX, but we can also add text blocks, tables, etc. via the “Add” button in the UI.

[^blocks-exprs]: The Desmos API uses “expressions”, but I find “block” less ambiguous.

The viewport renders the results of those blocks in the editor. When you add a block and type $y = x$, that’s rendered as a line. For simplicity, we’ll use the term ***graphs*** to refer to any rendered result.[^graphs]

[^graphs]: The viewport also renders points, labels, inequalities, polygons, etc. Whether you consider all of those ‘graphs’ will depend on your definition.

> Of course, not all blocks produce a visible result; some are just defining variables or Actions, and text blocks certainly don’t produce anything.


<br>


## How does Desmost work?

The rationale behind Desmost is to create a **textual representation** of the blocks in the editor – not just the LaTeX and text content, but rich Desmos-specific metadata like slider bounds, colouring, styling, and all.

> Unfinished!


<br>