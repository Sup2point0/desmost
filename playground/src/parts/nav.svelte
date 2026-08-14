<!-- @component `<Nav>` -->

<script lang="ts">

import { prefs } from "#scripts/prefs";

interface Props {
  is_compiling: boolean;
  recompile: () => void;
}

let { is_compiling, recompile }: Props = $props();

</script>

<nav>
  <div class="left">
    <h1> Desmost <span>Playground</span> &ensp; <small>by Sup#2.0</small> </h1>

    <button
      class:off={!$prefs.options}
      onclick={() => { $prefs.options = !$prefs.options; }}
    >
      Options
    </button>

    <button
      class:off={!$prefs.debug}
      onclick={() => { $prefs.debug = !$prefs.debug; }}
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
  </div>

  <div class="right">
    <a target="_blank" href="https://github.com/Sup2point0/desmost/tree/main/docs">Docs</a>
    <a target="_blank" href="https://github.com/Sup2point0/desmost/blob/main/docs/writing/learn-x-in-y.md">Learn</a>
    <a target="_blank" href="https://github.com/Sup2point0/desmost/blob/main/docs/spec/readme.md">Spec</a>
    <a target="_blank" href="https://github.com/Sup2point0/desmost">GitHub</a>
    <a target="_blank" href="https://www.npmjs.com/package/desmost">npm</a>
  </div>
</nav>


<style lang="scss">

$pad-vert: 0.5rem;
$font-size: 1.25rem;

nav {
  padding-right: 1rem;
  z-index: 10;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: stretch;

  background: $col-deut;
  box-shadow: 0 2px 4px rgb(black, 40%);

  > div {
    display: flex;
    flex-flow: row nowrap;
    align-items: stretch;
  }

  .left { flex: 2; justify-content: start; }
  .center { flex: 1; justify-content: center; }
  .right { flex: 2; justify-content: end; }
}

.left {
  h1 {
    padding: $pad-vert 1.5rem;
    margin-right: 1rem;
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

  &#recompile {
    padding: 0 1.5rem;

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

</style>
