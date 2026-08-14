<!-- @component `<DesmostSource>`

-->

<script lang="ts">

import { version } from "#playground/node_modules/desmost/package.json" with { type: "json" };

interface Props {
  source: string;
}

let { source = $bindable() }: Props = $props();


</script>


<div class="panel">
  <header>
    <h2> Source </h2>
    <small> Desmost <span>v{version}</span> </small>
  </header>

  <textarea bind:value={source}></textarea>
</div>


<style lang="scss">

.panel {
  min-height: 0;
  display: flex;
  flex-flow: column nowrap;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: $col-deut #002;
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
  flex: 1;
  min-height: max-content;
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

</style>
