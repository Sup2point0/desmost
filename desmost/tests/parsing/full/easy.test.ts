import { DesmostParser, Ast } from "../../../src/parser";

import { ltx } from "../../shared";
import { is_expr, parses_blank, parses_block } from "../shared";
import { EASY } from "../../cases/easy";


test("easy", () =>
{
	let parser = new DesmostParser(EASY);
	let r: Ast;
	
	// f(0) = 0
	r = parses_block(parser);
	is_expr(r);
	assert.equal(r.data.latex, ltx `f(0) = 0`);
	
	// f(1) = 1
	r = parses_block(parser);
	is_expr(r);
	assert.equal(r.data.latex, ltx `f(1) = 1`);
	
	// f(n) = f(n-1) + f(n)
	r = parses_block(parser);
	is_expr(r);
	assert.equal(r.data.latex, ltx `f(n) = f(n-1) + f(n)`);

	parses_blank(parser);
	
	// \frac{1}{10} \sum_{n=1}^{10} \frac{f(n+1)}{f(n)}
	r = parses_block(parser);
	is_expr(r);
	assert.equal(r.data.latex, ltx `\frac{1}{10} \sum_{n=1}^{10} \frac{f(n+1)}{f(n)}`);

	assert.isUndefined(parser.parse_next());
})
