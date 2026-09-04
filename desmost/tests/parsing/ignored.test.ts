import { DesmostParser, Ast } from "../../src/parser";

import { parses_block } from "./shared";


test("ignores CR", () => {
	let parser = new DesmostParser(`y\r\nx`);
	let r: Ast;

	r = parses_block(parser);
	assert.equal(r.data.latex, `y`);
	r = parses_block(parser);
	assert.equal(r.data.latex, `x`);
});
