<!-- @component `<Nav>` -->

<script lang="ts">

import { prefs } from "#scripts/prefs";
import { options } from "#scripts/options";

interface Props {
  is_compiling: boolean;
  recompile: () => void;
  is_decompiling: boolean;
  redecompile: () => void;
}

let { is_compiling, recompile, is_decompiling, redecompile }: Props = $props();

</script>

<nav>
  <div class="left">
    <h1> Desmost <span>Playground</span> &ensp;<small>by Sup#2.0</small> </h1>

    <button
      class:off={!$prefs.show_options}
      onclick={() => { $prefs.show_options = !$prefs.show_options; }}
    >
      Options
    </button>

    <button
      class:off={!$options.debug}
      onclick={() => { $options.debug = !$options.debug; }}
    >
      Debug
    </button>
  </div>

  <div class="center">
    <button id="recompile" class:off={is_compiling} onclick={recompile}>
      {#if is_compiling} Recompiling...
      {:else} Recompile
      {/if}
    </button>
    
    <button id="redecompile" class:off={is_decompiling} onclick={redecompile}>
      {#if is_decompiling} Decompiling...
      {:else} Decompile
      {/if}
    </button>
  </div>

  <div class="right">
    <a target="_blank" href="https://github.com/Sup2point0/desmost/tree/main/docs">Docs</a>
    <a target="_blank" href="https://github.com/Sup2point0/desmost/blob/main/docs/writing/learn-x-in-y.md">Learn</a>
    <a target="_blank" href="https://github.com/Sup2point0/desmost/blob/main/docs/spec/readme.md">Spec</a>
    <a target="_blank" href="https://www.npmjs.com/package/desmost">npm</a>
    <a target="_blank" href="https://github.com/Sup2point0/desmost">GitHub</a>
  </div>
</nav>


<style lang="scss">

$pad-vert: 0.5rem;
$font-size: 1.2rem;

nav {
  padding-right: 1rem;
  z-index: 10;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: stretch;

  background: $col-blue;
  box-shadow: 0 2px 4px rgb(black, 40%);

  > div {
    display: flex;
    flex-flow: row nowrap;
    align-items: stretch;

    &.left { flex: 2; justify-content: start; }
    &.center { flex: 1; justify-content: center; }
    &.right { flex: 2; justify-content: end; }
  }
}

.left {
  h1 {
    min-width: max-content;
    padding: $pad-vert 1.25rem;
    margin-right: 0.6rem;
    @include font-ui;
    color: white;
    font-size: $font-size;
    font-weight: normal;
    background: rgb(black, 20%);

    a {
      color: white;
      text-decoration: none;
    }
  }
}

a, button {
  min-width: max-content;
  padding: $pad-vert 0.5em;
  @include font-ui;
  color: white;
  font-size: $font-size;
  text-decoration: none;
  background: none;
  border: none;
  outline: none;

  &:hover, &:focus-visible {
    cursor: pointer;
    background: rgb(black, 10%);
  }

  &:active {
    background: rgb(black, 25%);
  }

  &.off {
    opacity: 50%;
  }

  .center & {
    padding: 0 $font-size;

    &:hover, &:focus-visible {
      background: rgb(black, 40%);
    }

    &:active {
      background: rgb(black, 60%);
    }
  }
}

small {
  color: rgb(white, 70%);
}


@media (max-width: 80rem) {
  .left small {
    display: none;
  }
}

@media (max-width: 60rem) {
  .right {
    display: none;
  }
}

</style>
