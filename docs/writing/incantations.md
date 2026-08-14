# Incantations Reference


## Expression
<!-- autodoc? expr -->
<table>
  <tr>
    <th> Incantation </th>
    <th> Argument </th>
    <th> Argument Type </th>
    <th> Description </th>
  </tr>
  <tr>
    <td>

[`/latex`](#latex)
    </td>
    <td>required</td>
    <td><code>string</code></td>
    <td></td>
  </tr>
<tr>
    <td>

[`/text`](#text)
    </td>
    <td>required</td>
    <td><code>string</code></td>
    <td></td>
  </tr>
</table>
<!-- autodoc. -->


## Global
<!-- autodoc? global -->
<table>
  <tr>
    <th> Incantation </th>
    <th> Argument </th>
    <th> Argument Type </th>
    <th> Description </th>
  </tr>
  <tr>
    <td>

[`/dark`](#dark)
    </td>
    <td>—</td>
    <td>—</td>
    <td></td>
  </tr>
<tr>
    <td>

[`/desmos`](#desmos)
    </td>
    <td>optional</td>
    <td>?</td>
    <td></td>
  </tr>
<tr>
    <td>

[`/viewport`](#viewport)
    </td>
    <td>required</td>
    <td><pre lang="ts"><code>{<br>  left: number; right: number;<br>  bottom: number; top: number;<br>}</code></pre></td>
    <td>Set the bounds of the viewport via `Calculator.setMathBounds()`.</td>
  </tr>
</table>
<!-- autodoc. -->


## Local
<!-- autodoc? local -->
<table>
  <tr>
    <th> Incantation </th>
    <th> Argument </th>
    <th> Argument Type </th>
    <th> Description </th>
  </tr>
  <tr>
    <td>

[`/color`](#color)<br>[`/colour`](#color)
    </td>
    <td>required</td>
    <td><code>DesmosColour</code></td>
    <td></td>
  </tr>
<tr>
    <td>

[`/dashed`](#dashed)
    </td>
    <td>—</td>
    <td>—</td>
    <td></td>
  </tr>
<tr>
    <td>

[`/fill`](#fill)
    </td>
    <td>required</td>
    <td><pre lang="ts"><code>{<br>  opacity: number;<br>}</code></pre></td>
    <td></td>
  </tr>
<tr>
    <td>

[`/hide`](#hide)
    </td>
    <td>—</td>
    <td>—</td>
    <td></td>
  </tr>
<tr>
    <td>

[`/no-line`](#no-line)
    </td>
    <td>—</td>
    <td>—</td>
    <td></td>
  </tr>
<tr>
    <td>

[`/point`](#point)
    </td>
    <td>required</td>
    <td><pre lang="ts"><code>{<br>  style: keyof typeof Desmos.Styles;<br>  size: number;<br>  opacity: number;<br>}</code></pre></td>
    <td></td>
  </tr>
<tr>
    <td>

[`/secret`](#secret)
    </td>
    <td>—</td>
    <td>—</td>
    <td></td>
  </tr>
<tr>
    <td>

[`/slider`](#slider)
    </td>
    <td>required</td>
    <td><pre lang="ts"><code>{<br>  min?: number \| string;<br>  max?: number \| string;<br>  step?: number \| string;<br>}</code></pre></td>
    <td></td>
  </tr>
</table>
<!-- autodoc. -->
