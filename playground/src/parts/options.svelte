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
  
  <section>
    <input id="ignore-comments" type="checkbox" bind:checked={$options.ignore_comments} />

    <label for="ignore-comments">
      <h3> Ignore Comments </h3>
      <p> Ignore <code>%</code> LaTeX comments instead of turning them into notes? </p>
    </label>
  </section>
</form>


<style lang="scss">

form {
  flex: 0.5;
  max-height: max-content;
  padding: 0.5rem 1rem;
  z-index: 2;
  border-bottom: 0.5px solid rgb(white, 30%);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: $col-green black;
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
  margin-bottom: 0.5rem;
  display: flex;
  flex-flow: row nowrap;
  gap: 1rem;

  h3 {
    margin-bottom: 0.2rem;
    @include font-ui;
    color: white;
    font-size: 100%;
    font-weight: normal;
  }

  p {
    @include font-ui;
    color: rgb(white, 40%);
    font-size: 90%;
  }

  &:hover p {
    color: white;
  }
}

</style>
