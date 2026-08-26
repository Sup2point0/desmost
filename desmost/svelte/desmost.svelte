<!-- @component `<Desmost>`

Mass-compile Desmost.

This transforms `<pre lang="desmos">` blocks into Desmos calculator embeds. It selects each `<pre lang="desmos">` block in its children, and for each constructs a `Desmos.GraphingCalculator` instance then calls the Desmost compiler on the source.

This is intended to be used with MDsveX or similar, where Markdown content containing ` ```desmos ` blocks is compiled into HTML.

When this component is unmounted, it calls `.destroy()` on each calculator instance to cleanup resources.

## Example

```svelte
<script>
    import Content from "./content.md";
</script>

<Desmost>
    <Content />
</Desmost>
```

With compile options:

```svelte
<Desmost options={{ errors: "crash" }}>
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


interface Props
{
  children: Snippet;

  /** Compile options to pass to Desmost.*/
  options?: DesmostOptions;

  /**
   * Default settings to apply to all Desmos calculator instances.
   * 
   * These are applied *before* compilation, so individual Desmost blocks can override them with `/desmos`.
   */
  settings?: Desmos.GraphConfiguration & Desmos.GraphSettings;

  /**
   * Should compilation be lazy using `IntersectionObserver`?
   * 
   * ## Example
   * 
   * ```svelte
   * <Desmost lazy />
   * ```
   */
  lazy?: true;

  /**
   * CSS styles to apply to each Desmos calculator's containing element.
   * 
   * ## Example
   * 
   * ```svelte
   * <Desmost style="margin: 1rem; border: 1px solid red" />
   * ```
   */
  style?: string;

  /**
   * Width of each Desmos calculator's containing element.
   * 
   * ## Example
   * 
   * ```svelte
   * <Desmost width="500px" />
   * <Desmost width="40rem" />
   * <Desmost width="80vw" />
   * ```
   */
  width?: string;
  
  /**
   * Height of each Desmos calculator's containing element.
   * 
   * ## Example
   * 
   * ```svelte
   * <Desmost height="500px" />
   * <Desmost height="40rem" />
   * <Desmost height="80vw" />
   * ```
   */
  height?: string;
}

let {
  children,
  options, settings,
  lazy,
  style, width, height,
}: Props = $props();


let root: HTMLElement;

let desmos_instances: Desmos.Calculator[] = [];
let lazy_observers: IntersectionObserver[] = [];

onMount(() =>
{
  let sources = root.querySelectorAll("pre[lang='desmos'], pre.language-desmos");

  for (let source of sources.values()) {
    source.style.display = "none";

    let el_desmos = source.parentNode!.insertBefore(
      document.createElement("div"),
      source.nextSibling,
    );
    
    if (width  != undefined) el_desmos.style.width = width;
    if (height != undefined) el_desmos.style.height = height;
    if (style  != undefined) el_desmos.style.cssText += style;

    if (!lazy) {
      inject(el_desmos, source.textContent);
    }
    else {
      let observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          inject(el_desmos, source.textContent);
          observer.disconnect();
        }
      });
      observer.observe(el_desmos);
      lazy_observers.push(observer);
    }
  }

  return () => {
    desmos_instances.forEach(d => d.destroy());
    lazy_observers.forEach(o => o.disconnect());
  };
});

function inject(el_desmos: HTMLElement, source: string)
{
  let desmos = Desmos.GraphingCalculator(el_desmos);

  if (settings != undefined) {
    desmos.updateSettings(settings);
  }

  desmos_instances.push(desmos);
  compile(desmos, source, options);
}

</script>


<div bind:this={root} style:display="contents">
  {@render children?.()}
</div>
