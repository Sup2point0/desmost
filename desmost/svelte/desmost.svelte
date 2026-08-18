<!-- @component `<Desmost>`

Compile Desmost from Markdown.

This transforms `<pre lang="desmos">` blocks into Desmos calculator embeds. It selects each `<pre lang="desmos">` block in its children, and for each constructs a `Desmos.GraphingCalculator` instance then calls the Desmost compiler on the source.

When this component is unmounted, it calls `.destroy()` on each calculator instance to cleanup resources.

## Example

```svelte
<script>
  import Content from "./content.svx";
</script>

<Desmost>
  <Content />
</Desmost>
```

With compile options:

```svelte
<Desmost errors="crash">
  <Content />
</Desmost>
```

With styling:

```svelte
<Desmost width="100%" height="50vh">
  <Content />
</Desmost>
```
-->

<script lang="ts">
/// <reference types="desmos" />

import { compile, type DesmostOptions } from "../src";

import { onMount, type Snippet } from "svelte";


interface Props extends DesmostOptions
{
  children: Snippet;

  /** CSS styles to apply to each Desmos calculator's containing element. */
  style?: string;

  /** Width of each Desmos calculator's containing element. */
  width?: string;
  
  /** Height of each Desmos calculator's containing element. */
  height?: string;
}

let { children, style, width, height, ...options }: Props = $props();


let root: HTMLElement;

let desmos_instances: Desmos.Calculator[] = [];

onMount(() =>
{
  let sources = root.querySelectorAll("pre[lang='desmos'], pre.language-desmos");

  for (let source of sources.values()) {
    source.style.display = "none";
    if (style != undefined) source.cssText = style;

    let el_desmos = source.parentNode!.insertBefore(
      document.createElement("div"),
      source.nextSibling,
    );

    let desmos = Desmos.GraphingCalculator(el_desmos);
    desmos_instances.push(desmos);

    compile(desmos, source.textContent, options);
  }

  return () => {
    for (let instance of desmos_instances) {
      instance.destroy();
    }
  };
});

</script>


<div bind:this={root} style:display="contents">
  {@render children?.()}
</div>
