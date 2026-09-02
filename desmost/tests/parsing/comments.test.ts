import { DesmostParser } from "../../src/parser"
import { is_expr, parses_block } from "./shared";

describe("%", () =>
{
	test.each([
		[`%`, ``],
		[`% `, ``],
		[`%\n`, ``],
		[`% sup`, `sup`],
		[`%  sup`, `sup`],
	])
	("basic", (src, expected) => {
		let parser = new DesmostParser(src);
		let r = parses_block(parser);

		is_expr(r);
		assert.equal(r.data.type, "text");
		// @ts-expect-error
		assert.equal(r.data.text, expected);
	})
})
