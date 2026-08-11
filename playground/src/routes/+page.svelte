<script lang="ts">

import "#styles/essence.scss";

import { compile } from "../../../desmost/src";

import Nav from "#parts/nav.svelte";

import { onMount, untrack } from "svelte";


const WELCOME = String.raw `
/text{ Welcome to Desmost! }
f\left( x \right) = x^2
`;

let source = $state(WELCOME.trim());

let el_desmos: HTMLElement;
let desmos: Desmos.Calculator | null;

let ast = $state<unknown>([]);
let exprs = $state<Desmos.ExpressionState[]>([]);

onMount(() => {
  if (typeof Desmos === "undefined") {
    desmos = null;
    return;
  }

  desmos = Desmos.GraphingCalculator(el_desmos, {
    border: false,
  });
});


$effect(() => {
  let src = source;

  let timeout = setTimeout(() => {
    if (desmos == null) return;
    desmos.setBlank();

    let debug = compile(desmos, src, { debug: true });

    untrack(() => {
      ast = debug?.ast ?? [];
      exprs = desmos!.getExpressions();
    });
  });

  return () => clearTimeout(timeout);
});

function debounce(timeout: number, callback: () => void)
{
  let debounce = 0;

  return () => {
    clearTimeout(debounce);
    debounce = setTimeout(callback, timeout);
  };
}

</script>


<div class="root">
  <Nav />

  <main>
    <textarea bind:value={source}></textarea>

    <div id="desmos" bind:this={el_desmos}>
      {#if desmos === null}
        <p> Oops, failed to load Desmos! Try checking your internet connection and reloading the page? </p>
      {/if}
    </div>

    <div class="ast">
      <pre lang="js"><code>{@html
        JSON.stringify(ast, undefined, "&emsp;").replaceAll("\n", "<br>")}
      </code></pre>
    </div>

    <div class="exprs">
      <pre lang="js"><code>{@html
        JSON.stringify(exprs, undefined, "&emsp;").replaceAll("\n", "<br>")}
      </code></pre>
    </div>
  </main>
</div>


<style lang="scss">

.root {
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-flow: column nowrap;
}

main {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 0.5fr 0.5fr;

  div {
    overflow-y: auto;
    min-height: 0;
  }
}

textarea {
  flex: 3;
  resize: none;
  width: 100%;
  min-height: 0;
  padding: 1rem;
  @include font-code;
  font-size: 120%;
  font-weight: 350;
  line-height: 1.5;
  color: white;
  background: #002;
  border: none;
  border-radius: 0;
  outline: none;

  scrollbar-width: thin;
  scrollbar-color: $col-deut #002;

  &::selection {
    background: rgb(#0088cc, 40%);
  }
}

code {
  @include font-code;
  line-height: 1.3;
}

</style>
