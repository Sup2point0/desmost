# Fervently Anticipated Questions


<br>


### Why did you create Desmost? / Who even needs this?

See [Rationale](../RATIONALE.md). Also hey man, we can create cool things for fun, not everything has to be useful or profitable!


<br>


## Why doesn’t Desmost render the Desmos calculator for me?

TLDR: That stuff’s messy, and you’ll most likely want to do it yourself.

Desmost only handles the focused job of compiling text to a calculator state. Stuff like rendering, mounting to the DOM, etc. will vary depending on your context and web framework of choice.

Desmost is like `rustc`, `gcc`, etc. It’s just 1 file in, 1 calculator out. Connecting that with other stuff is left to you with `cargo` and `make`.

That said, I use SvelteKit and MDsveX, so Desmost provides a nicely encapsulated Svelte component for that use case ;)


<br>


## Why does Desmost only work client-side in the browser, and not server-side?

Desmost uses the [Desmos API<sup>↗</sup>](https://www.desmos.com/api/v1.12/docs/index.html), and the Desmos API (currently) must be included in your webpage via `<script src="..."></script>`. This only works client-side in the browser.

You’ll realise this yourself when you try to call `compile(calc, src)`. You need to pass in a Desmos calculator instance `calc`. To construct that `Desmos.GraphingCalculator(element)`, you need both the Desmos API to access `Desmos`, and a DOM `element` to mount the calculator into. These both require the browser!

So unfortunately, no server-side Desmost =(


<br>


## How fast is Desmost? / Why is Desmost so slow?

Fast enough, is the answer ;)

Even though compiling client-side sounds like a terrible idea, Desmost’s performance is **basically identical** to you using the Desmos API yourself.

Desmost compilation has 2 parts: parsing the AST, and evaluating it (via the Desmos API). Parsing is extremely fast. You could parse huge source files client-side, no problem! The bottleneck is interacting with Desmos. It’s unfortunately pretty damn slow.

After parsing your source code, Desmost injects the results into the Desmos calculator via the `.setExpression()` method provided by the Desmos API. This method is surprisingly expensive – ostensibly because Desmos does a lot of internal recomputation and updates per call.[^set-expressions] This scales linearly with every additional expression to evaluate, so the more expressions, the more expensive.

[^set-expressions]: And no, `.setExpressions()` is not more performant. **It’s just a wrapper around calling `.setExpression()` in a loop.** 💀

You can see this for yourself in [Playground](https://sup2point0.github.io/desmost) (open **Debug** to see compile time). Even adding *blank lines* ups it by dozens of ms. Meanwhile, in unit tests with a dummy Desmos instance, compilation an average-length documents takes well under 2 ms. You see what I mean when I say it makes no difference to your users?

I hate to say it, but unfortunately this is one of those “it’s them, not me” issues. Nevertheless, I do plan on investigating to see whether I cN do anything on my end to speed things up!


<br>


## Ok then, can I pre-compile the Desmost AST server-side, then evaluate it client-side?

You could, but the bottleneck is still evaluation, you wouldn’t really be gaining any performance. You’d also be sending an entire serialised AST to the client, rather than the raw string source, which sounds more expensive to me :P


<br>


## Can I use Desmost to develop in Desmos?

Well, you’d probably want incremental compilation for that, and I haven’t implemented that yet. If your project is large recompilations will probably become prohibitively expensive.

Personally, I find Desmos’s UI very pleasant, so I see no reason to seek an alternative =)


<br>


## Where does the `/incantation{}` syntax come from?

Mate, are you havin a bubble bath?

It’s LaTeX ofc! Except the `\` backslash is mirrored, to avoid confusing Desmost with LaTeX.


<br>


## Why do I need a `::` separator?

Technically speaking, a separator is not necessary for Desmost to parse your source correctly! But it does make error recovery from unclosed brackets significantly easier.

```hs
/label{ text: "This argument wasn’t fi :: (0, 0)
-- Now we can keep (0, 0) and keep parsing, instead of completely imploding
```

From a practical standpoint, it’s also useful for people learning Desmost’s syntax to have a very clear marker separating Desmost from LaTeX.

```hs
-- a jumbled mess...
/colour{GREEN} /line{opacity: 0.5} \int_{0}^{t} \frac{1}{t} f(t) \ dt

-- clear boundary between Desmost and LaTeX!
/colour{GREEN} /line{opacity: 0.5} :: \int_{0}^{t} \frac{1}{t} f(t) \ dt
```


<br>


## Why is `::` the separator?

TODO


<br>


## Where does the name “incantation” come from?

Calling them “commands” is boring. “Control sequence” is too long. DSLs are pretty magical, so hey, each one is a little ‘incantation’ that transforms your calculator in some way ^v^


<br>


## Why didn’t you write Desmost in Rust?

The Desmos API is JavaScript, so interfacing with it in JavaScript (TypeScript) makes the most sense, no?

And sure, speed is speed, but for our expected input sizes, Rust would be overkill. The bottleneck is Desmos, not Desmost!


<br>
