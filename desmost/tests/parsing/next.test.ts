import { DesmostError } from "../../src/errors";
import { DesmostParser } from "../../src/parser";

import { is_expr, parses_block } from "./shared";


describe("parse-next", () =>
{
	test.each([
		`/hide :: y = x^2`,
		`/hide:: y = x^2`,
		`/hide ::y = x^2`,
		`/hide::y = x^2`,
	])
	("basic", src => {
		let parser = new DesmostParser(src);
		let r = parses_block(parser);

		is_expr(r);
		assert.equal(r.data.latex, `y = x^2`);
	});

	test.each([
		`/hide\n:: y = x^2`,
		`/hide\n  :: y = x^2`,
		`/hide \n:: y = x^2`,
		`/hide\n\n:: y = x^2`,
		`/hide\n\n  :: y = x^2`,
	])
	("leading line breaks", src => {
		let parser = new DesmostParser(src);
		let r = parses_block(parser);
		
		is_expr(r);
		assert.equal(r.data.latex, `y = x^2`);
	});

	test.each([
		`/hide ::\ny = x^2`,
		`/hide ::\n  y = x^2`,
		`/hide ::\n\ny = x^2`,
		`/hide ::\n\n  y = x^2`,
	])
	("trailing line breaks", src => {
		let parser = new DesmostParser(src);
		let r = parses_block(parser);
		
		is_expr(r);
		assert.equal(r.data.latex, `y = x^2`);
	});

	test.each([
		`/viewport`,
	])
	("global (invalid)", src => {
		let parser = new DesmostParser(src);

		let r = parser.parse_next();
		assert.isDefined(r);

		let { blocks, errors } = r;
		assert.isEmpty(blocks);
		assert.isNotEmpty(errors);
		assert.isTrue(errors.at(-1) instanceof DesmostError.MissingInput);
	});
})
