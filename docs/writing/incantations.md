# Incantations Reference


## Expression
<!-- autodoc? expr -->
<table>
  <tr></tr>
  <tr>
    <th> Incantation </th>
    <th> Argument </th>
    <th> Argument Type </th>
    <th> Description </th>
  </tr>
  <tr></tr>
  <tr>
    <td>

[`/latex`](#latex)
    </td>
    <td>required</td>
    <td><code>string</code></td>
    <td>Produce a LaTeX expression. This allows the input to span multiple lines.</td>
  </tr>
<tr></tr>
  <tr>
    <td>

[`/text`](#text)
    </td>
    <td>required</td>
    <td><code>string</code></td>
    <td>Produce a text expression (“Add Note” in the Desmos GUI).</td>
  </tr>
</table>
<!-- autodoc. -->


## Global
<!-- autodoc? global -->
<table>
  <tr></tr>
  <tr>
    <th> Incantation </th>
    <th> Argument </th>
    <th> Argument Type </th>
    <th> Description </th>
  </tr>
  <tr></tr>
  <tr>
    <td>

[`/dark`](#dark)
    </td>
    <td>—</td>
    <td>—</td>
    <td>Enable dark mode for the calculator, which inverts all colours.</td>
  </tr>
<tr></tr>
  <tr>
    <td>

[`/desmos`](#desmos)
    </td>
    <td>optional</td>
    <td>?</td>
    <td>Set the configuration of the calculator via `Calculator.updateSettings()`.</td>
  </tr>
<tr></tr>
  <tr>
    <td>

[`/viewport`](#viewport)
    </td>
    <td>required</td>
    <td><pre lang="ts"><code>{
<br>
  left: number; right: number;
<br>
  bottom: number; top: number;
<br>
}</code></pre></td>
    <td>Set the bounds of the viewport via `Calculator.setMathBounds()`.</td>
  </tr>
</table>
<!-- autodoc. -->


## Local
<!-- autodoc? local -->
<table>
  <tr></tr>
  <tr>
    <th> Incantation </th>
    <th> Argument </th>
    <th> Argument Type </th>
    <th> Description </th>
  </tr>
  <tr></tr>
  <tr>
    <td>

[`/color`](#color)<br>[`/colour`](#color)
    </td>
    <td>required</td>
    <td><code>DesmosColour</code></td>
    <td></td>
  </tr>
<tr></tr>
  <tr>
    <td>

[`/dashed`](#dashed)
    </td>
    <td>—</td>
    <td>—</td>
    <td>Render a block as a dashed line.</td>
  </tr>
<tr></tr>
  <tr>
    <td>

[`/fill`](#fill)
    </td>
    <td>required</td>
    <td><pre lang="ts"><code>{
<br>
  opacity: number;
<br>
}</code></pre></td>
    <td>Change fill styles for a block.</td>
  </tr>
<tr></tr>
  <tr>
    <td>

[`/hide`](#hide)
    </td>
    <td>—</td>
    <td>—</td>
    <td>Hide rendering for a block. This includes graphs, points, polygons, etc.</td>
  </tr>
<tr></tr>
  <tr>
    <td>

[`/no-line`](#no-line)
    </td>
    <td>—</td>
    <td>—</td>
    <td>Disable rendering lines for a block.</td>
  </tr>
<tr></tr>
  <tr>
    <td>

[`/point`](#point)
    </td>
    <td>required</td>
    <td><pre lang="ts"><code>{
<br>
  style?: keyof typeof Desmos.Styles;
<br>
  size?: number;
<br>
  opacity?: number;
<br>
}</code></pre></td>
    <td></td>
  </tr>
<tr></tr>
  <tr>
    <td>

[`/secret`](#secret)
    </td>
    <td>—</td>
    <td>—</td>
    <td>Turn a block into a secret expression, which is hidden from the end user.</td>
  </tr>
<tr></tr>
  <tr>
    <td>

[`/slider`](#slider)
    </td>
    <td>required</td>
    <td><pre lang="ts"><code>{
<br>
  min?: number \| string;
<br>
  max?: number \| string;
<br>
  step?: number \| string;
<br>
}</code></pre></td>
    <td>Set the bounds of the slider for a variable.</td>
  </tr>
</table>
<!-- autodoc. -->
