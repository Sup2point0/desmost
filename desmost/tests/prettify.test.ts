import { prettify_latex } from "../src/compiler/format";
import { prettify_source } from "../src/decompiler/format";

import { ltx } from "./shared";


test.each([
	ltx `y = x`,
	ltx `y =< x`,
	ltx `y >= x`,
	ltx `f(x) = x`,
	ltx `\{ x > 0: 1, -1 \}`,
	ltx `min(x, y)`,
	ltx `0 < x and x < 1`,
])
("source (%s)", src =>
{
	assert.equal(prettify_source(prettify_latex(src)), src);
});

test.each([
	ltx `y = x`,
	ltx `y \leq x`,
	ltx `y \geq x`,
	ltx `f\left(x\right) = x`,
	ltx `\left\{ x > 0:\ 1,\ -1 \right\}`,
	ltx `\min\left(x,\ y\right)`,
	ltx `0 < x \operatorname{and} x < 1`,
])
("latex (%s)", src =>
{
	assert.equal(prettify_latex(prettify_source(src)), src);
});
