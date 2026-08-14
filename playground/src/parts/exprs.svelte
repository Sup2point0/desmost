<!-- @component `<DesmosExpressions>` -->

<script lang="ts">

interface Props {
  exprs: Desmos.ExpressionState[];
}

let { exprs }: Props = $props();


let open = $state(false);


function show_expr(expr: Desmos.ExpressionState)
{
  expr = { ...expr };

  let did_redact = false;

  if (!open) {
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

  let json = JSON.stringify(expr, undefined, "&emsp;");
  
  if (!open && did_redact) {
    json = json.replaceAll("\n}", ",\n  ...\n}");
  }

  return json.replaceAll("\n", "<br>");
}

</script>


<ul>
  {#each exprs as expr}
    <li onclick={() => { open = !open; }}>
      <pre lang="js"><code>{@html show_expr(expr) }</code></pre>
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
    line-height: 1.3;
  }
}

</style>
