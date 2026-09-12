import { DesmostParser, Ast } from "../../src/parser";

import { parses_block } from "./shared";


describe("ignores tab", () =>
{
	test.each([
		`1\n\t2`,
		`1\t\n2`,
		`1\t\n2\t`,
	])
	("as indentation", src => {
		let parser = new DesmostParser(src);
		let r: Ast;

		r = parses_block(parser);
		assert.equal(r.data.latex, `1`);
		r = parses_block(parser);
		assert.equal(r.data.latex, `2`);
	});

	test.each([
		`\t\nx`,
		`\t\t\nx`,
	])
	("as empty", src => {
		let parser = new DesmostParser(src);
		let r: Ast;

		r = parses_block(parser);
		assert.equal(r.data.latex, ` `);
		r = parses_block(parser);
		assert.equal(r.data.latex, `x`);
	});
})

test("ignores CR", () => {
	let parser = new DesmostParser(`y\r\nx`);
	let r: Ast;

	r = parses_block(parser);
	assert.equal(r.data.latex, `y`);
	r = parses_block(parser);
	assert.equal(r.data.latex, `x`);
});
