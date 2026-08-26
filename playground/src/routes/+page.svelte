<script lang="ts">

import "#styles/essence.scss";
import "#styles/prism.scss";

// import { compile } from "../../../desmost/src";
import { compile } from "desmost";
// import { desmos_to_ast, ast_to_source } from "../../../desmost/src/index.internal";
import { desmos_to_ast, ast_to_source } from "desmost/internal";
import type { Ast, DesmostDebug } from "desmost/internal";

import { prefs } from "#scripts/prefs";
import { options } from "#scripts/options";

import Nav from "#parts/nav.svelte";
import DesmostSource from "#parts/source.svelte";
import DesmostAst from "#parts/ast.svelte";
import DesmosExpressions from "#parts/exprs.svelte";

import { onMount, untrack } from "svelte";


let el_desmos: HTMLElement;
let el_blank: HTMLElement;
let desmos: Desmos.Calculator | null;
let blank: Desmos.Calculator;
let blank_state: unknown;

onMount(() => {
  if (typeof Desmos === "undefined") {
    desmos = null;
    return;
  }

  desmos = Desmos.GraphingCalculator(el_desmos, { border: false });
  blank = Desmos.GraphingCalculator(el_blank, { border: false });
  blank_state = blank.getState();

  // @ts-expect-error: outdated types
  desmos.observeEvent("change", (_, e) => {
    if (e.isUserInitiated) {
      redecompile();
    }
  });
});


// TODO move into examples
const WELCOME = String.raw `
% Welcome to Desmost!
f(x) = x^2
`;

let source = $state(WELCOME.trim());
let ast: Ast[] = $state([]);
let exprs: Desmos.ExpressionState[] = $state([]);

let is_compiling = $state(false);
let is_decompiling = $state(false);

let debug: Partial<DesmostDebug> = $state({
  duration: 0,
  num_blocks: 0,
});

$effect(() => {
  let _ = source;
  let __ = $options;
  return untrack(recompile);
});

function recompile()
{
  /* NOTE: This avoids decompilation triggering a recompilation due to Svelte reactivity */
  if (is_decompiling) return;

  is_compiling = true;

  let timeout = setTimeout(() => {
    if (desmos == null) {
      is_compiling = false;
      return;
    }

    desmos.setState(blank_state);

    let r;
    try {
      r = compile(desmos, source, $options);
    } catch {
      r = undefined;
    }

    if (r != undefined) {
      debug.duration   = r.duration;
      debug.num_blocks = r.num_blocks;
      ast              = r.ast ?? ["COMPILER ERROR"];
    }

    sync_desmos_to_exprs();
    is_compiling = false;
  }, 50);

  return () => clearTimeout(timeout);
}

function sync_desmos_to_exprs()
{
  if (desmos == undefined) return;

  exprs = desmos.getExpressions();

  if (exprs == undefined) {
    // @ts-ignore: exceptional
    exprs = ["DESMOS ERROR"];
    return;
  }
}

function redecompile()
{
  sync_desmos_to_exprs();

  if (desmos == undefined) return;

  is_decompiling = true;
  ast = desmos_to_ast(desmos, blank); 
  source = ast_to_source(ast);

  /* NOTE: Finish 1 frame later to avoid triggering circular recompilation */
  requestAnimationFrame(() => { is_decompiling = false; });
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


<div id="desmos-blank" bind:this={el_blank}></div>

<div class="root" onmousemove={continue_drag} onmouseup={finish_drag}>
  <Nav {is_compiling} {recompile} {is_decompiling} {redecompile} />

  <main
    class:debug={$options.debug}
    style:--frac-x={$prefs.frac_x}
    style:--frac-y={$prefs.frac_y}
  >
    <DesmostSource bind:source {debug} />

    <div class="resize-drag x" onmousedown={start_drag("x")}></div>

    <div id="desmos" bind:this={el_desmos}>
      {#if desmos === null}
        <p> Oops, failed to load Desmos! Try checking your internet connection and reloading the page? </p>
      {/if}
    </div>

    {#if $options.debug}
      <div class="resize-drag y" onmousedown={start_drag("y")}></div>
      <div></div>
      <div class="resize-drag y" onmousedown={start_drag("y")}></div>

      <DesmostAst ast={ast} />
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
  $drag-size: 0.25px;
  $drag-scale: 8;

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
    transform-origin: 100% 100%;

    &.x { transform: scaleX($drag-scale); &:hover { cursor: ew-resize; } }
    &.y { transform: scaleY($drag-scale); &:hover { cursor: ns-resize; } }

    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
    }
    &.x::after { transform: scaleX($drag-scale); }
    &.y::after { transform: scaleY($drag-scale); }

    &:hover, &:active { background: #ff60ff; }
    &:active { filter: brightness(75%); }
  }
}

#desmos {
  overflow-y: auto;
  min-height: 0;
  z-index: 2;
  box-shadow: 0 2px 4px rgb(black, 20%);

  p {
    width: 80%;
    margin: 3rem auto;
    @include font-code;
    color: $col-red;
    text-align: center;
  }
}

#desmos-blank {
  display: none;
}

</style>
