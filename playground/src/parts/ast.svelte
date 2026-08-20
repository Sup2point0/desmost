<!-- @component `<DesmostAst>` -->

<script lang="ts">

import Prism from "prismjs";

import type { Ast } from "desmost/internal";


interface Props {
  ast: Ast[];
}

let { ast }: Props = $props();


let json = $derived(JSON.stringify(ast, undefined, "  "));
let highlighted = $derived(Prism.highlight(json, Prism.languages.javascript, "javascript"));

</script>


<div class="panel">
  <header>
    <h2> Compiled AST </h2>
  </header>

  <ul>
    <li>
      <pre lang="js"><code>{@html highlighted}</code></pre>
    </li>
  </ul>
</div>


<style lang="scss">

.panel {
  z-index: 2;
  background: #002;
  border-top: 0.5px solid rgb(white, 30%);
  box-shadow: -4px -4px 8px rgb(black, 80%);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: $col-orange #002;
}

ul {
  padding: 0 0.5rem;
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

li {
  pre {
    padding: 0.5rem;
  }

  code {
    @include font-code;
    color: white;
    font-size: 90%;
    line-height: 1.4;
    word-break: break-all;
    white-space: pre-wrap;
  }
}

</style>
