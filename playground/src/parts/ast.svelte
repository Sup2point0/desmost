<!-- @component `<DesmostAst>`

-->

<script lang="ts">

import type { Ast } from "desmost/internal";


interface Props {
  ast: Ast[];
  duration: number | undefined;
}

let { ast, duration }: Props = $props();

</script>


<ul>
  {#if duration}
    <aside>Compiled in {Math.round(duration * 10) / 10} ms</aside>
  {/if}

  <li>
    <pre lang="js"><code>{@html
      JSON.stringify(ast, undefined, "&emsp;").replaceAll("\n", "<br>")}
    </code></pre>
  </li>
</ul>


<style lang="scss">

ul {
  padding: 0.5rem 0.25rem;
  overflow-y: auto;
  min-height: 0;
  position: relative;;
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

aside {
  position: absolute;
  top: 1rem;
  right: 1rem;
  @include font-ui;
  color: $col-deut;
}

</style>
