<script lang="ts">

import "#styles/essence.scss";
import "#styles/prism.scss";

// import { compile } from "../../../desmost/src";
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

  // @ts-expect-error: outdated types
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


let drag_state: "x" | "y" | null = $state(null);

let init = {
  x: 0, y: 0,
  frac_x: 0, frac_y: 0,
};

function start_drag(state: "x" | "y"): (e: MouseEvent) => void
{
  return e => {
    drag_state = state;

    init.x = e.clientX;
    init.y = e.clientY;
    init.frac_x = $prefs.frac_x;
    init.frac_y = $prefs.frac_y;
  };
}

function continue_drag(e: MouseEvent)
{
  switch (drag_state) {
    case "x": {
      let delta_x = e.clientX - init.x;
      let delta_frac = delta_x / window.innerWidth;
      $prefs.frac_x = init.frac_x + delta_frac;
      $prefs.frac_x = Math.max(0.2, Math.min(0.8, $prefs.frac_x));
      break;
    }
    case "y": {
      let delta_y = e.clientY - init.y;
      let delta_frac = delta_y / window.innerHeight;
      $prefs.frac_y = init.frac_y + delta_frac;
      $prefs.frac_y = Math.max(0.2, Math.min(0.8, $prefs.frac_y));
      break;
    }
    case null:
      return;
  }
}

function finish_drag()
{
  drag_state = null;
}

</script>


<div class="root" onmousemove={continue_drag} onmouseup={finish_drag}>
  <Nav {is_compiling} {recompile} />

  <main
    class:debug={$prefs.debug}
    style:--frac-x={$prefs.frac_x}
    style:--frac-y={$prefs.frac_y}
  >
    <DesmostSource bind:source {duration} />

    <div class="resize-drag x" onmousedown={start_drag("x")}></div>

    <div id="desmos" bind:this={el_desmos}>
      {#if desmos === null}
        <p> Oops, failed to load Desmos! Try checking your internet connection and reloading the page? </p>
      {/if}
    </div>

    {#if $prefs.debug}
      <div class="resize-drag y" onmousedown={start_drag("y")}></div>
      <div></div>
      <div class="resize-drag y" onmousedown={start_drag("y")}></div>

      <DesmostAst {ast} />
      <div class="resize-drag x" onmousedown={start_drag("x")}></div>
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
  $drag-size: 0.5px;

  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns:
    calc(100% * var(--frac-x, 1) - $drag-size / 2)
    $drag-size
    calc(100% * (1 - var(--frac-x, 1)) - $drag-size / 2)
  ;

  &.debug {
    grid-template-rows:
      calc(100% * var(--frac-y, 1) - $drag-size / 2)
      $drag-size
      calc(100% * (1 - var(--frac-y, 1)) - $drag-size / 2)
    ;
  }

  .resize-drag {
    user-select: none;
    position: relative;
    z-index: 4;
    background: transparent;
    transform-origin: 50% 50%;

    &.x { transform: scaleX(5); &:hover { cursor: ew-resize; } }
    &.y { transform: scaleY(5); &:hover { cursor: ns-resize; } }

    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
    }
    &.x::after { transform: scaleX(5); }
    &.y::after { transform: scaleY(5); }

    &:hover, &:active { background: #ff60ff; }
    &:active { filter: brightness(75%); }
  }
}

#desmos {
  overflow-y: auto;
  min-height: 0;
  z-index: 2;
  box-shadow: 0 2px 4px rgb(black, 20%);
}

</style>
