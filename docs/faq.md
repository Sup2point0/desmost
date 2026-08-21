# Fervently Anticipated Questions


### Why does Desmost only work in the browser?
Desmost uses the [Desmos API<sup>↗</sup>](https://www.desmos.com/api/v1.12/docs/index.html), and the Desmos API (currently) must be included in your webpage via `<script src="..."></script>`. This only works client-side in the browser.

### Why do I need a `::` separator?
Technically speaking, a separator is not necessary for Desmost to parse your source correctly! But from a practical standpoint, it’s useful for people learning the syntax to very clearly distinguish Desmost incantations from LaTeX.

### Why is Desmost so slow?
It’s not Desmost, it’s Desmos!

Desmost’s parsing is extremely fast, but interacting with Desmos is slow.

After parsing your source code, Desmost injects the results into the Desmos calculator via the `.setExpression()` method provided by the Desmos API. This method is surprisingly expensive, ostensibly because Desmos does a lot of internal computation and updates per call.

I’m investigating to see whether I can do anything on my end!
