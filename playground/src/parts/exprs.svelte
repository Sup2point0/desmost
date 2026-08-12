<!-- @component `<DesmosExpressions>` -->

<script lang="ts">

interface Props {
  exprs: Desmos.ExpressionState[];
}

let { exprs }: Props = $props();


let open = $state(false);

</script>


<ul>
  {#each exprs as expr}
    {@const shown_data = open ? expr : Object.fromEntries(
      Object.entries(expr)
        .filter(([key, value]) => !(
          value === ""
          || typeof value === "object" && Object.values(value).every(v => v === "")
        ))
    )}

    <li>
      <pre lang="js"><code>{@html
        JSON.stringify(shown_data, undefined, "&emsp;").replaceAll("\n", "<br>")
      }</code></pre>
    </li>
  {/each}
</ul>


<style lang="scss">

ul {
  padding: 0.5rem 0.25rem;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5rem;
  list-style-type: none;
  background: #f9f9f9;
  scrollbar-width: thin;

  li {
    background: white;
    box-shadow: 0 2px 4px rgb(black, 20%);
  }

  pre {
    padding: 0.5rem;
  }

  code {
    @include font-code;
    font-size: 90%;
    line-height: 1.3;
  }
}

</style>
