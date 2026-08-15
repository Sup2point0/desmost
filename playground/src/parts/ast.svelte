<!-- @component `<DesmostAst>`

-->

<script lang="ts">

import Prism from "prismjs";

import type { Ast } from "desmost/internal";


interface Props {
  ast: Ast[];
}

let { ast }: Props = $props();


let json = $derived(JSON.stringify(ast, undefined, "  "));
// let cleaned = $derived(json.replaceAll("\n", "<br>"));
let highlighted = $derived(Prism.highlight(json, Prism.languages.javascript, "javascript"));

</script>


<ul>
  <li>
    <pre lang="js"><code>{@html highlighted}</code></pre>
  </li>
</ul>


<style lang="scss">

ul {
  padding: 0.5rem 0.25rem;
  overflow-y: auto;
  min-height: 0;
  background: #002;
  border-top: 0.5px solid rgb(white, 30%);
  box-shadow: -4px -4px 8px rgb(black, 50%);
  scrollbar-width: thin;
  scrollbar-color: $col-orange #002;

  pre {
    padding: 0.5rem;
  }

  code {
    @include font-code;
    color: white;
    font-size: 90%;
    line-height: 1.3;
    word-break: break-all;
    white-space: pre-wrap;
  }
}

</style>
