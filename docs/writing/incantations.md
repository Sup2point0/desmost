# Incantations Reference


## Expression
<!-- autodoc? expr -->
| Incantation | Argument | Argument Type | Description |
| :---------- | :------- | :------------ | :---------- |
| [`/latex`](#latex) | required | `?` |  |
| [`/text`](#text) | required | `?` |  |
<!-- autodoc. -->


## Global
<!-- autodoc? global -->
| Incantation | Argument | Argument Type | Description |
| :---------- | :------- | :------------ | :---------- |
| [`/dark`](#dark) | — | `—` |  |
| [`/desmos`](#desmos) | optional | `?` |  |
| [`/viewport`](#viewport) | required | `ViewportBounds { left: number; right: number; bottom: number; top: number; }` | Set the bounds of the viewport via `Calculator.setMathBounds()`. |
<!-- autodoc. -->


## Local
<!-- autodoc? local -->
| Incantation | Argument | Argument Type | Description |
| :---------- | :------- | :------------ | :---------- |
| [`/color`](#color)<br>[`/colour`](#color) | required | `?` |  |
| [`/dashed`](#dashed) | — | `—` |  |
| [`/fill`](#fill) | required | `FillOptions { opacity: number; }` |  |
| [`/hide`](#hide) | — | `—` |  |
| [`/no-line`](#no-line) | — | `—` |  |
| [`/point`](#point) | required | `PointStyles { style: keyof typeof Desmos.Styles; size: number; opacity: number; }` |  |
| [`/secret`](#secret) | — | `—` |  |
| [`/slider`](#slider) | required | `SliderBounds { min?: number | string; max?: number | string; step?: number | string; }` |  |
<!-- autodoc. -->
