# Incantations Reference


## Expression
<!-- autodoc? expr -->
| Incantation | Argument | Argument Type | Description |
| :---------- | :------- | :------------ | :---------- |
| [`/latex`](#latex) | required | <pre lang="ts"><code>?</code></pre> |  |
| [`/text`](#text) | required | <pre lang="ts"><code>?</code></pre> |  |
<!-- autodoc. -->


## Global
<!-- autodoc? global -->
| Incantation | Argument | Argument Type | Description |
| :---------- | :------- | :------------ | :---------- |
| [`/dark`](#dark) | — | <pre lang="ts"><code>—</code></pre> |  |
| [`/desmos`](#desmos) | optional | <pre lang="ts"><code>?</code></pre> |  |
| [`/viewport`](#viewport) | required | <pre lang="ts"><code>{<br>  left: number; right: number;<br>  bottom: number; top: number;<br>}</code></pre> | Set the bounds of the viewport via `Calculator.setMathBounds()`. |
<!-- autodoc. -->


## Local
<!-- autodoc? local -->
| Incantation | Argument | Argument Type | Description |
| :---------- | :------- | :------------ | :---------- |
| [`/color`](#color)<br>[`/colour`](#color) | required | <pre lang="ts"><code>?</code></pre> |  |
| [`/dashed`](#dashed) | — | <pre lang="ts"><code>—</code></pre> |  |
| [`/fill`](#fill) | required | <pre lang="ts"><code>{<br>  opacity: number;<br>}</code></pre> |  |
| [`/hide`](#hide) | — | <pre lang="ts"><code>—</code></pre> |  |
| [`/no-line`](#no-line) | — | <pre lang="ts"><code>—</code></pre> |  |
| [`/point`](#point) | required | <pre lang="ts"><code>{<br>  style: keyof typeof Desmos.Styles;<br>  size: number;<br>  opacity: number;<br>}</code></pre> |  |
| [`/secret`](#secret) | — | <pre lang="ts"><code>—</code></pre> |  |
| [`/slider`](#slider) | required | <pre lang="ts"><code>{<br>  min?: number \| string;<br>  max?: number \| string;<br>  step?: number \| string;<br>}</code></pre> |  |
<!-- autodoc. -->
