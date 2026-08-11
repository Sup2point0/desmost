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

let time_delta: number | undefined = $state();
let ast: any[] = $state([]);
let exprs: Desmos.ExpressionState[] = $state([]);

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

    let debug;

    try {
      debug = compile(desmos, src, { debug: true });
    } catch {
      debug = undefined;
    }

    untrack(() => {
      time_delta = debug?.time_delta;
      ast = debug?.ast ?? ["COMPILER ERROR"];
      exprs = desmos!.getExpressions();
    });
  }, 50);

  return () => clearTimeout(timeout);
});

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
      {#if time_delta}
        <aside>Compiled in {Math.round(time_delta * 10) / 10} ms</aside>
      {/if}

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

.ast {
  position: relative;

  aside {
    position: absolute;
    top: 1rem;
    right: 1rem;
    @include font-ui;
    color: $col-deut;
  }
}

code {
  @include font-code;
  line-height: 1.3;
}

</style>
