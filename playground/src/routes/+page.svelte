<script lang="ts">

import "#styles/essence.scss";

import { compile } from "../../../desmost/src";

import { onMount } from "svelte";


let source = $state(String.raw `

/text{ Welcome to Desmost! }
f\left( x \right) = x^2

  `.trim());

let el_desmos: HTMLElement;
let desmos: Desmos.Calculator;

onMount(() => {
  desmos = Desmos.GraphingCalculator(el_desmos);
});

$effect(() => {
  desmos.setBlank();
  compile(desmos, source);
});

</script>


<main>
  <textarea bind:value={source}></textarea>

  <div bind:this={el_desmos}></div>
</main>


<style lang="scss">

main {
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
}

textarea {
  flex: 1;
}

div {
  flex: 1;
}

</style>
