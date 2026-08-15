<script lang="ts">

import "#styles/essence.scss";
import "#styles/prism.scss";

import { compile } from "desmost";

import { prefs } from "#scripts/prefs";

import Nav from "#parts/nav.svelte";
import DesmostSource from "#parts/source.svelte";
import DesmostAst from "#parts/ast.svelte";
import DesmosExpressions from "#parts/exprs.svelte";

import { onMount } from "svelte";


let el_desmos: HTMLElement;
let desmos: Desmos.Calculator | null | undefined = $state(undefined);

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


// TODO move into examples
const WELCOME = String.raw `
/text{ Welcome to Desmost! }
f\left( x \right) = x^2
`;

let source = $state(WELCOME.trim());

let is_compiling = $state(false);
let duration: number | undefined = $state();
let ast: any[] = $state([]);
let exprs: Desmos.ExpressionState[] = $state([]);

$effect(() => {
  let _ = source;
  recompile();
});

function recompile()
{
  is_compiling = true;

  let timeout = setTimeout(() => {
    if (desmos == null) return;

    desmos.setBlank();

    let debug;
    try {
      debug = compile(desmos, source, { debug: true });
    } catch {
      debug = undefined;
    }

    duration = debug?.duration;
    ast = debug?.ast ?? ["COMPILER ERROR"];
    sync_exprs_with_desmos();
    is_compiling = false;
  }, 50);

  return () => clearTimeout(timeout);
}

function sync_exprs_with_desmos()
{
  // @ts-ignore: exceptional
  exprs = desmos?.getExpressions() ?? ["DESMOS ERROR"];
}


let dragging = $state(false);
let frac = $state(0.5);

let x_init = 0;
let frac_init = 0;

function start_drag(e: MouseEvent)
{
  dragging = true;
  x_init = e.clientX;
  frac_init = frac;
}

function continue_drag(e: MouseEvent)
{
  if (!dragging) return;

  let delta_x = e.clientX - x_init;
  let delta_frac = delta_x / window.innerWidth;
  frac = frac_init + delta_frac;
  frac = Math.max(0.2, Math.min(0.8, frac));
}

function finish_drag()
{
  dragging = false;
}

$inspect(frac)

</script>


<div class="root" onmousemove={continue_drag} onmouseup={finish_drag}>
  <Nav {is_compiling} {recompile} />

  <main
    style:--rows={$prefs.debug ? 2 : 1}
    style:--frac={frac}
  >
    <DesmostSource bind:source {duration} />

    <div class="resize-drag" onmousedown={start_drag}></div>

    <div id="desmos" bind:this={el_desmos}>
      {#if desmos === null}
        <p> Oops, failed to load Desmos! Try checking your internet connection and reloading the page? </p>
      {/if}
    </div>

    {#if $prefs.debug}
      <DesmostAst {ast} />
      <div class="resize-drag" onmousedown={start_drag}></div>
      <DesmosExpressions {exprs} />
    {/if}
  </main>
</div>


<style lang="scss">

.root {
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  position: relative;
}

main {
  $drag-width: 0.5px;

  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns:
    calc(100% * var(--frac, 1) - $drag_width / 2)
    $drag-width
    calc(100% * (1 - var(--frac, 1)) - $drag_width / 2)
  ;
  grid-template-rows: repeat(var(--rows, 1), 1fr);

  .resize-drag {
    user-select: none;
    z-index: 4;
    background: transparent;
    transform: scaleX(7);
    transform-origin: 50%;

    &:hover {
      cursor: ew-resize;
      background: #ff60ff;
    }

    &:active {
      background: $col-red;
    }
  }
}

#desmos {
  overflow-y: auto;
  min-height: 0;
  z-index: 2;
  box-shadow: 0 2px 4px rgb(black, 20%);
}

</style>
