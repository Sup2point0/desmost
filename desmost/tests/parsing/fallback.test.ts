import { DesmostParser } from "../../src/parser";

import { is_expr, parses_block } from "./shared";


test.each([
	`/invalid`,
	`/invalid{}`,
	`/invalid{} :: y = x`,
])
("/invalid incantation falls back to LaTeX", src => {
	let parser = new DesmostParser(src);
	let r = parses_block(parser);
	
	is_expr(r);
	assert.equal(r.data.latex, src);
})
