import { DesmostParser, Ast } from "../../../src/parser";

import { ltx } from "../../shared";
import { assert_is_expression, assert_parses_blank_line } from "../shared";
import { EASY } from "../../cases/easy";


test("easy", () =>
{
	let parser = new DesmostParser(EASY);
	let r: Ast | null;
	
	// f(0) = 0
	r = parser.parse_next();
	assert_is_expression(r);
	// @ts-expect-error: outdated types
	assert.equal(r.data.latex, ltx `f(0) = 0`);
	
	// f(1) = 1
	r = parser.parse_next();
	assert_is_expression(r);
	// @ts-expect-error: outdated types
	assert.equal(r.data.latex, ltx `f(1) = 1`);
	
	// f(n) = f(n-1) + f(n)
	r = parser.parse_next();
	assert_is_expression(r);
	// @ts-expect-error: outdated types
	assert.equal(r.data.latex, ltx `f(n) = f(n-1) + f(n)`);

	assert_parses_blank_line(parser);
	
	// \frac{1}{10} \sum_{n=1}^{10} \frac{f(n+1)}{f(n)}
	r = parser.parse_next();
	assert_is_expression(r);
	// @ts-expect-error: outdated types
	assert.equal(r.data.latex, ltx `\frac{1}{10} \sum_{n=1}^{10} \frac{f(n+1)}{f(n)}`);

	r = parser.parse_next();
	assert.isNull(r);
})
