<!-- @component `<DesmosExpressions>` -->

<script lang="ts">

interface Props {
  exprs: Desmos.ExpressionState[];
}

let { exprs }: Props = $props();

</script>


<ul>
  {#each exprs as expr}
    <li>
      <pre lang="js"><code>{@html
        JSON.stringify(expr, undefined, "&emsp;").replaceAll("\n", "<br>")
      }</code></pre>
    </li>
  {/each}
</ul>


<style lang="scss">

ul {
  padding: 0.5rem;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
  list-style-type: none;
  background: #f9f9f9;

  li {
    background: white;
    box-shadow: 0 2px 4px rgb(black, 20%);
  }

  pre {
    padding: 0.5rem;
  }

  code {
    @include font-code;
    line-height: 1.3;
  }
}

</style>
