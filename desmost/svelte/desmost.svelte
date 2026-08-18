<!-- @component `<Desmost>`

Compile Desmost from Markdown.

This transforms `<pre lang="desmos">` blocks into Desmos calculator embeds. It selects each `<pre lang="desmos">` block in its children, and for each constructs a `Desmos.GraphingCalculator` instance then calls the Desmost compiler on the source.
-->

<script lang="ts">
/// <reference types="desmos" />

import { compile, DesmostOptions } from "../src";

import { onMount } from "svelte";


interface Props extends DesmostOptions
{
  children: unknown;  // FIXME
  style: string;
  width: string;
  height: string;
}

let { children, style, width, height, ...options }: Props = $props();


const root: HTMLElement;

let desmos_instances: Desmos.Calculator[] = [];

onMount(() =>
{
  let sources = root.querySelectorAll("pre[lang='desmos'], pre.language-desmos");

  for (let source of sources.values()) {
    source.style.display = "none";

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


<div bind:this={root}>
  {@render children?.()}
</div>
