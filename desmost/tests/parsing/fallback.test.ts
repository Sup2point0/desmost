import { DesmostParser } from "../../src/parser";

import { assert_is_expression } from "./shared";


test.each([
	`/invalid`,
	`/invalid{}`,
	`/invalid{} :: y = x`,
])
("/invalid incantation falls back to LaTeX", src => {
	let parser = new DesmostParser(src);
	let r = parser.parse_next();
	assert_is_expression(r);
	assert.equal(r.data.latex, src);
})
