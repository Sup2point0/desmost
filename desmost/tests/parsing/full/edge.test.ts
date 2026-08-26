import { DesmostParser, Ast } from "../../../src/parser";

import { assert_is_expression, assert_parses_blank_line } from "../shared";


test("empty", () =>
{
	let parser = new DesmostParser(``);
	assert_parses_blank_line(parser);
	let r = parser.parse_next();
	assert.isNull(r);
})


test("re-call", () =>
{
	let parser = new DesmostParser(``);
	assert_parses_blank_line(parser);
	
	for (let i = 0; i < 3; i++) {
		let r = parser.parse_next();
		assert.isNull(r);
	}
})


describe("blank lines", () =>
{
	test("inline blank", () => {
		let parser = new DesmostParser(`
y = x

y = x^2
		`.trim());
		let r: Ast | null;

		parser.parse_next();
		assert_parses_blank_line(parser);
		parser.parse_next();
		r = parser.parse_next();
		assert.isNull(r);
	})
	
	test.each([2, 5, 20, 100])
	("inline blanks", n => {
		let parser = new DesmostParser(`
y = x
${"\n".repeat(n)}
y = x^2
		`.trim());
		let r: Ast | null;

		parser.parse_next();
		for (let i = 0; i < n + 1; i++) {
			assert_parses_blank_line(parser);
		}
		parser.parse_next();
		r = parser.parse_next();
		assert.isNull(r);
	})

	test("leading blank", () => {
		let parser = new DesmostParser(`\ny = x`);
		let r: Ast | null;

		assert_parses_blank_line(parser);
		parser.parse_next();
		r = parser.parse_next();
		assert.isNull(r);
	})

	test("leading blanks", () => {
		let parser = new DesmostParser(`\n\n\ny = x`);
		let r: Ast | null;

		assert_parses_blank_line(parser);
		assert_parses_blank_line(parser);
		assert_parses_blank_line(parser);
		parser.parse_next();
		r = parser.parse_next();
		assert.isNull(r);
	})

	test("trailing blank", () =>
	{
		let parser = new DesmostParser(`y = x\n`);
		let r: Ast | null;

		parser.parse_next();
		assert_parses_blank_line(parser);
		r = parser.parse_next();
		assert.isNull(r);
	})

	test("trailing blanks", () =>
	{
		let parser = new DesmostParser(`y = x\n\n\n`);
		let r: Ast | null;

		parser.parse_next();
		assert_parses_blank_line(parser);
		assert_parses_blank_line(parser);
		assert_parses_blank_line(parser);
		r = parser.parse_next();
		assert.isNull(r);
	})
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

		let r = parser.parse_next();
		assert_is_expression(r);
		assert.equal(r.data.latex, "y = x");
	})

	test.each([
		`\n  y = x`,
		`\n  /hide :: y = x`,
		`\n  /latex{ y = x }`,
	])
	("leading spaces (with blanks)", src => {
		let parser = new DesmostParser(src);

		assert_parses_blank_line(parser);
		let r = parser.parse_next();
		assert_is_expression(r);
		assert.equal(r.data.latex, "y = x");
	})

	test.each([
		`y = x  `,
		`/hide :: y = x  `,
		`/latex{ y = x }  `,
	])
	("trailing spaces", src => {
		let parser = new DesmostParser(src);

		let r = parser.parse_next();
		assert_is_expression(r);
		assert.equal(r.data.latex, "y = x");
	})

	test.each([
		`\ny = x  \ny = x^2`,
		`\n/hide :: y = x  \ny = x^2`,
		`\n/latex{ y = x }  \ny = x^2`,
	])
	("trailing spaces (with blanks)", src => {
		let parser = new DesmostParser(src);
		let r: Ast | null;
		
		assert_parses_blank_line(parser);
		r = parser.parse_next();
		assert_is_expression(r);
		assert.equal(r.data.latex, "y = x");
		r = parser.parse_next();
		assert_is_expression(r);
		assert.equal(r.data.latex, "y = x^2");
		r = parser.parse_next();
		assert.isNull(r);
	})
})
