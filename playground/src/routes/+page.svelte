<script lang="ts">

import "#styles/essence.scss";

import { compile } from "../../../desmost/src";

import Nav from "#parts/nav.svelte";

import { onMount } from "svelte";


let source = $state(String.raw `

/text{ Welcome to Desmost! }
f\left( x \right) = x^2

  `.trim());

let el_desmos: HTMLElement;
let desmos: Desmos.Calculator;

onMount(() => {
  desmos = Desmos.GraphingCalculator(el_desmos, {
    border: false,
  });
});

$effect(() => {
  desmos.setBlank();
  compile(desmos, source);
});

</script>


<div class="root">
  <Nav />

  <main>
    <textarea bind:value={source}></textarea>
    <div bind:this={el_desmos}></div>
  </main>
</div>


<style lang="scss">

.root {
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
}

main {
  flex: 1;
  display: flex;
  flex-flow: row nowrap;
}

textarea {
  resize: none;
  flex: 1;
  padding: 1rem;
  @include font-code;
  font-size: 120%;
  font-weight: 350;
  line-height: 1.5;
  color: white;
  background: #002;
  border: none;
  border-radius: 0;

  scrollbar-width: thin;
  scrollbar-color: $col-deut #002;

  &::selection {
    background: rgb(#0088cc, 40%);
  }
}

div {
  flex: 1;
}

</style>
