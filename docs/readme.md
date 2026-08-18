# Desmost Docs

Welcome to Desmost!

Here you’ll find information on how to [write](writing/) and [compile](compiling/) Desmost.


<br>


## Important Prefaces

Keep these in mind when using Desmost!

### Desmost only works in the browser
Desmost relies on the [Desmos API](https://www.desmos.com/api/v1.12/docs/index.html), which (currently) must be included with a `<script>` tag, and these only work via the DOM in the browser.

### Desmost assumes the Desmos API is accessible
The Desmos API requires an API key to use (free for non-commercial uses), so you will need to include the Desmos API with your own API key.

### Desmost doesn’t render Desmos
Desmost injects the results of compilation into an existing `Desmos.Calculator` instance (which is a JavaScript object, not rendered in the DOM).

Rendering is intentionally left open-ended so you can render the calculator however you see fit in your framework of choice.

However, Desmost does provide a Svelte component for rendering Desmost in Markdown:

```ts
import { Desmost } from "desmost/svelte";
```

### Desmost doesn’t handle LaTeX
Not all LaTeX works with Desmos – for instance, it doesn’t support `\\` newlines.

Desmost doesn’t validate your LaTeX in any way. It only performs the minimum work required to detect where LaTeX starts and ends, so making sure your LaTeX is valid is left up to you!
