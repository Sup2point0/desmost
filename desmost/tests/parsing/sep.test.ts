import { DesmostParser } from "../../src/parser";


describe("parse-sep", () =>
{
	test.each([
		` :: `,
		`:: `,
		` ::`,
		`::`,
	])("easy", src => {
		let parser = new DesmostParser(src);

		parser.parse_sep();
		let r = parser.parse_next();
		assert.isNull(r);
	})

	test.each([
		` ::\n  `,
		` ::\n`,
		` :: \n`,
		`:: \n`,
		`::\n`,
	])("medium", src => {
		let parser = new DesmostParser(src);

		parser.parse_sep();
		let r = parser.parse_next();
		assert.isNull(r);
	})
})
