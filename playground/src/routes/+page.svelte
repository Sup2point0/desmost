<script lang="ts">

import "#styles/essence.scss";

import { compile } from "desmost";

import Nav from "#parts/nav.svelte";
import DesmostSource from "#parts/source.svelte";
import DesmostAst from "#parts/ast.svelte";
import DesmosExpressions from "#parts/exprs.svelte";

import { onMount, untrack } from "svelte";


const WELCOME = String.raw `
/text{ Welcome to Desmost! }
f\left( x \right) = x^2
`;

let source = $state(WELCOME.trim());

let el_desmos: HTMLElement;
let desmos: Desmos.Calculator | null | undefined = $state(undefined);

let duration: number | undefined = $state();
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

  desmos.observeEvent("change", (_, e) => {
    if (e.isUserInitiated) {
      sync_exprs_with_desmos();
    }
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
      duration = debug?.duration;
      ast = debug?.ast ?? ["COMPILER ERROR"];
      sync_exprs_with_desmos();
    });
  }, 50);

  return () => clearTimeout(timeout);
});

function sync_exprs_with_desmos()
{
  // @ts-ignore: exceptional
  exprs = desmos?.getExpressions() ?? ["DESMOS ERROR"];
}

</script>


<div class="root">
  <Nav />

  <main>
    <DesmostSource bind:source />

    <div id="desmos" bind:this={el_desmos}>
      {#if desmos === null}
        <p> Oops, failed to load Desmos! Try checking your internet connection and reloading the page? </p>
      {/if}
    </div>

    <DesmostAst {ast} {duration} />
    <DesmosExpressions {exprs} />
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
  grid-template-rows: 1fr 1fr;

  div {
    overflow-y: auto;
    min-height: 0;
  }
}

#desmos {
  z-index: 2;
  box-shadow: 0 2px 4px rgb(black, 20%);
}

</style>
