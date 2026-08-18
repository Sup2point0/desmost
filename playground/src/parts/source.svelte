<!-- @component `<DesmostSource>` -->

<script lang="ts">

import { version } from "#playground/node_modules/desmost/package.json" with { type: "json" };

import type { DesmostDebug } from "../../../desmost/src/index.internal";


interface Props {
  source: string;
  debug: Partial<DesmostDebug>;
}

let { source = $bindable(), debug }: Props = $props();

</script>


<div class="container">
  <div class="panel">
    <header>
      <h2> Source </h2>
      <small> Desmost <span>v{version}</span> </small>
    </header>

    <textarea bind:value={source}></textarea>
  </div>

  {#if debug.duration}
    <aside>
      <p> Compiled in <span>{Math.round(debug.duration * 10) / 10}</span> ms </p>

      {#if debug.num_blocks}
        <p class="per">
          <span>{Math.round(debug.duration / debug.num_blocks * 10) / 10}</span> ms / block
        </p>
      {/if}
    </aside>
  {/if}
</div>


<style lang="scss">

.container {
  min-height: 0;
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  background: #002;
}

.panel {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: $col-blue #002;
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

  small {
    @include font-code;
    color: rgb(white, 50%);

    span {
      color: white;
    }
  }
}

textarea {
  field-sizing: content;
  resize: none;
  width: 100%;
  min-height: 80%;
  padding: 0.5rem 1rem 1rem;
  @include font-code;
  font-size: 120%;
  font-weight: 350;
  line-height: 1.5;
  color: white;
  background: #002;
  border: none;
  border-radius: 0;
  outline: none;

  &::selection {
    background: rgb(#0088cc, 40%);
  }
}

aside {
  position: absolute;
  bottom: 1rem;
  right: 1.5rem;
  @include font-ui;
  color: $col-blue;
  text-align: right;

  .per {
    padding-top: 0.25em;
    color: rgb(white, 60%);
    font-size: 90%;
  }
}

</style>
