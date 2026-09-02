import { DesmostParser, Ast } from "../../../src/parser";

import { is_expr, parses_block, parses_blank } from "../shared";


test("empty", () =>
{
	let parser = new DesmostParser(``);
	parses_blank(parser);
	let r = parser.parse_next();
	assert.isUndefined(r);
});


test("re-call", () =>
{
	let parser = new DesmostParser(``);
	parses_blank(parser);
	
	for (let i = 0; i < 3; i++) {
		assert.isUndefined(parser.parse_next());
	}
});


describe("blank lines", () =>
{
	test("inline blank", () => {
		let parser = new DesmostParser(`
y = x

y = x^2
		`.trim());

		parser.parse_next();
		parses_blank(parser);
		parser.parse_next();
		assert.isUndefined(parser.parse_next());
	});
	
	test.each([2, 5, 20, 100])
	("inline blanks", n => {
		let parser = new DesmostParser(`
y = x
${"\n".repeat(n)}
y = x^2
		`.trim());

		parser.parse_next();
		for (let i = 0; i < n + 1; i++) {
			parses_blank(parser);
		}
		parser.parse_next();
		assert.isUndefined(parser.parse_next());
	});

	test("leading blank", () => {
		let parser = new DesmostParser(`\ny = x`);

		parses_blank(parser);
		parser.parse_next();
		assert.isUndefined(parser.parse_next());
	});

	test("leading blanks", () => {
		let parser = new DesmostParser(`\n\n\ny = x`);

		parses_blank(parser);
		parses_blank(parser);
		parses_blank(parser);
		parser.parse_next();
		assert.isUndefined(parser.parse_next());
	});

	test("trailing blank", () =>
	{
		let parser = new DesmostParser(`y = x\n`);

		parser.parse_next();
		parses_blank(parser);
		assert.isUndefined(parser.parse_next());
	});

	test("trailing blanks", () =>
	{
		let parser = new DesmostParser(`y = x\n\n\n`);

		parser.parse_next();
		parses_blank(parser);
		parses_blank(parser);
		parses_blank(parser);
		assert.isUndefined(parser.parse_next());
	});
})


describe("spaces", () =>
{
	test.each([
		`  y = x`,
		`  /hide :: y = x`,
		`  /latex{ y = x }`,
	])
	("leading spaces", src => {
		let parser = new DesmostParser(src);

		let r = parses_block(parser);
		is_expr(r);
		assert.equal(r.data.latex, "y = x");
	});

	test.each([
		`\n  y = x`,
		`\n  /hide :: y = x`,
		`\n  /latex{ y = x }`,
	])
	("leading spaces (with blanks)", src => {
		let parser = new DesmostParser(src);

		parses_blank(parser);
		let r = parses_block(parser);
		is_expr(r);
		assert.equal(r.data.latex, "y = x");
	});

	test.each([
		`y = x  `,
		`/hide :: y = x  `,
		`/latex{ y = x }  `,
	])
	("trailing spaces", src => {
		let parser = new DesmostParser(src);

		let r = parses_block(parser);
		is_expr(r);
		assert.equal(r.data.latex, "y = x");
	});

	test.each([
		`\ny = x  \ny = x^2`,
		`\n/hide :: y = x  \ny = x^2`,
		`\n/latex{ y = x }  \ny = x^2`,
	])
	("trailing spaces (with blanks)", src => {
		let parser = new DesmostParser(src);
		let r: Ast;
		
		parses_blank(parser);
		r = parses_block(parser);
		is_expr(r);
		assert.equal(r.data.latex, "y = x");
		r = parses_block(parser);
		is_expr(r);
		assert.equal(r.data.latex, "y = x^2");
		assert.isUndefined(parser.parse_next());
	});
})
