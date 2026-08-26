<!-- @component `<DesmosExpressions>` -->

<script lang="ts">

import Json5 from "json5";
import Prism from "prismjs";


interface Props {
  exprs: Desmos.ExpressionState[];
}

let { exprs }: Props = $props();


function show_expr(expression: Desmos.ExpressionState & { open: boolean })
{
  let expr = { ...expression };

  let did_redact = false;

  if (!expression.open) {
    for (let [key, value] of Object.entries(expr)) {
      if (
        value === ""
        || typeof value === "object" && Object.values(value).every(v => v === "")
      ) {
        delete expr[key as keyof Desmos.ExpressionState];
        did_redact = true;
      }
    }
  }

  let json = Json5.stringify(expr, undefined, "  ");
  
  if (!expression.open && did_redact) {
    json = json.replaceAll("\n}", ",\n  ...\n}");
  }

  let highlighted = Prism.highlight(json, Prism.languages.javascript, "javascript");
  
  return highlighted;
}

</script>


<ul>
  {#each exprs as expr, i}
    <li onclick={() => { expr.open = !expr.open; }}>
      <pre lang="js"><code>{i + 1}: {@html show_expr(expr) }</code></pre>
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

    &:hover, &:focus-visible {
      cursor: pointer;
      background: transparent;
    }

    &:active {
      background: rgb(black, 10%);
    }
  }

  pre {
    padding: 0.5rem;
  }

  code {
    @include font-code;
    color: black;
    font-size: 90%;
    line-height: 1.4;

    :global(.token.property) { color: $col-blue; }
    :global(.token.string) { color: $col-red; }
    :global(.token.boolean) { color: $col-orange; font-style: italic; }
    :global(.token.operator) { color: rgb(black, 40%); }
    :global(.token.punctuation) { color: rgb(black, 40%); }
  }
}

</style>
