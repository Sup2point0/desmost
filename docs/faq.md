# Fervently Anticipated Questions


<br>


### Why does Desmost only work client-side in the browser? / Why can’t I use Desmost server-side?
Desmost uses the [Desmos API<sup>↗</sup>](https://www.desmos.com/api/v1.12/docs/index.html), and the Desmos API (currently) must be included in your webpage via `<script src="..."></script>`. This only works client-side in the browser.

Also, constructing a `Desmos.GraphingCalculator(element)` requires a DOM `element` to mount it into. That’s only possible in the actual browser!

So unfortunately, no server-side Desmost =(


<br>


### How fast is Desmost?
Fast enough, is the answer ;)

Compilation has 2 parts: parsing the AST, and evaluating it (via the Desmos API).

Desmost’s parsing is extremely fast. You could parse huge source files client-side, no problem! The bottleneck is interacting with Desmos. It’s unfortunately pretty damn slow.

After parsing your source code, Desmost injects the results into the Desmos calculator via the `.setExpression()` method provided by the Desmos API. This method is surprisingly expensive – ostensibly because Desmos does a lot of internal recomputation and updates per call.[^set-expressions] This scales linearly with every additional expression to evaluate, so the more expressions, the more expensive.

[^set-expressions]: And no, `.setExpressions()` is not more performant. **It’s just a wrapper around calling `.setExpression()` in a loop.**

I hate to say it, but unfortunately this is one of those “it’s them, not me” issues. Nevertheless, I do plan on investigating to see whether I cN do anything on my end to speed things up!


<br>


### Ok then, can I pre-compile the Desmost AST server-side, then evaluate it client-side?
Not currently.

1) The Desmost compiler parses and compiles *lazily*, 1 expression at a time. So parsing and evaluating aren’t 2 separate phases.
2) It probably won’t improve performance, because the bottleneck is Desmos, not Desmost compilation (see below).[^perf]

[^perf]: You’d also be sending an AST to the client rather than the raw source, which sounds more expensive to me lmao


<br>


### How fast is Desmost? / Why is Desmost so slow?
It’s not Desmost, it’s Desmos!




### Why do I need a `::` separator?
Technically speaking, a separator is not necessary for Desmost to parse your source correctly! But it does make error recovery from unclosed brackets significantly easier.

From a practical standpoint, it’s also useful for people learning Desmost’s syntax to have a very clear marker separating Desmost from LaTeX.

```hs
-- a jumbled mess...
/colour{GREEN} /line{opacity: 0.5} \int_{0}^{t} \frac{1}{t} f(t) \ dt

-- clear boundary between Desmost and LaTeX!
/colour{GREEN} /line{opacity: 0.5} :: \int_{0}^{t} \frac{1}{t} f(t) \ dt
```

<br>
