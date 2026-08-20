<!-- @component `<DesmostOptions>`

The dropdown panel for configuring compile options.
-->

<script lang="ts">

import { options } from "#scripts/options";

</script>


<header>
  <h2> Compile Options </h2>
</header>

<form>
  <section>
    <input id="prettify" type="checkbox" bind:checked={$options.prettify} />

    <label for="prettify">
      <h3> Prettify </h3>
      <p> Prettify LaTeX output for Desmos? </p>
    </label>
  </section>
</form>


<style lang="scss">

form {
  padding: 0 1rem 1rem;
  z-index: 2;
  border-bottom: 0.5px solid rgb(white, 30%);
  // box-shadow: 0 4px 8px black;
}

header {
  padding: 0.5rem 1rem;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background: #002;

  h2 {
    @include font-code;
    color: rgb(white, 50%);
    font-size: 80%;
    font-weight: normal;
  }
}

section {
  display: flex;
  flex-flow: row nowrap;
  gap: 1rem;

  h3 {
    @include font-ui;
    color: $col-blue;
    font-weight: normal;
  }

  p {
    @include font-ui;
    color: rgb(white, 50%);
  }
}

</style>
