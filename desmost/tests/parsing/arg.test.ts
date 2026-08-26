import { DesmostParser } from "../../src/parser";
import { Incantation } from "../../src/magic";

import { matrix } from "../shared";


const ARG_TYPES = [
	Incantation.ArgType.STRING,
	Incantation.ArgType.LATEX,
	Incantation.ArgType.OBJECT,
];


function run_test(
	arg_type: Incantation.ArgType,
	[src, expected]: string[],
)
{
	expected ??= "<NO EXPECTED CASE PROVIDED>";

	let parser = new DesmostParser(src);
	let r = parser.parse_incantation_arg(arg_type);
	assert.equal(r, expected);
}


describe("parse-arg()", () =>
{
	describe("omitted", () =>
	{
		test.each(ARG_TYPES)
		("empty", arg_type => {
			let parser = new DesmostParser(`{}`);
			let r = parser.parse_incantation_arg(arg_type);
			assert.equal(r, "");
		});

		test.each(matrix(
			ARG_TYPES.filter(arg_type => arg_type !== Incantation.ArgType.STRING),
			[
				`{ }`,
				`{  }`,
				`{\n}`,
				`{ \n}`,
				`{\n }`,
				`{ \n }`,
				`{\n\n}`,
				`{ \n \n }`,
				`{ \n \r\n }`,
			].map(src => [src, ""])
		))
		("whitespace", run_test);
	})

	describe("string", () =>
	{
		test.each(matrix([Incantation.ArgType.STRING], [
				`{sup}`,
				`{sup }`,
				`{ sup}`,
				`{ sup }`,
				`{\nsup\n}`,
				`{\n  sup\n}`,
			].map(src => [src, src.slice(1, -1)])
		))
		(`"sup"`, run_test);
		
		test.each(matrix([Incantation.ArgType.STRING], [
			[`{don't track}`, `don't track`],
		]))
		(`with quotes`, run_test);
	})

	describe("object", () =>
	{
		test.each(matrix([Incantation.ArgType.OBJECT], [
			[`{x: 1}`,           `x: 1`],
			[`{x: 1 }`,          `x: 1`],
			[`{ x: 1}`,          `x: 1`],
			[`{ x: 1 }`,         `x: 1`],
			[`{ x: 1, y: 2 }`,   `x: 1, y: 2`],
			[`{ sup: 2.0 }`,     `sup: 2.0`],
		]))
		("flat", run_test);

		test.each(matrix([Incantation.ArgType.OBJECT], [
			[`{obj:{x:1}}`,       `obj:{x:1}`],
			[`{ obj: { x: 1 }}`,  `obj: { x: 1 }`],
			[`{ obj: { x: 1 } }`, `obj: { x: 1 }`],
		]))
		("nested", run_test);

		test.each(matrix([Incantation.ArgType.OBJECT], [
			[`{ sup: 'world' }`, `sup: 'world'`],
			[`{ sup: "world" }`, `sup: "world"`],
			[`{ sup: \`world\` }`, `sup: \`world\``],
		]))
		("with strings", run_test);

		test.each(matrix([Incantation.ArgType.OBJECT], [
			[`{ diabolical: '{error' }`, `diabolical: '{error'`],
			[`{ diabolical: "{error" }`, `diabolical: "{error"`],
		]))
		("with { in string", run_test);

		test.each(matrix([Incantation.ArgType.OBJECT], [
			[`{ diabolical: 'error}' }`, `diabolical: 'error}'`],
			[`{ diabolical: "error}" }`, `diabolical: "error}"`],
		]))
		("with } in string", run_test);

		test.each(matrix([Incantation.ArgType.OBJECT], [
			[`{ problem: "don't don't" }`, `problem: "don't don't"`],
			[`{ problem: "don't do it" }`, `problem: "don't do it"`],
		]))
		("with ' in \" string", run_test);

		test.each(matrix([Incantation.ArgType.OBJECT], [
			[`{ problem: 'this "quote" might break' }`, `problem: 'this "quote" might break'`],
			[`{ problem: 'this "quote is broken' }`, `problem: 'this "quote is broken'`],
		]))
		("with \" in ' string", run_test);

		test.each([
			`{ sup`,
			`{ this: "does not end`,
			`{ this: "does not end }`,
			`{ this: "does not end"`,
			`{ malformed: { }`,
			`{ malformed: ""lmao" }`,
		])
		("crashes if unmatched", src => {
			let parser = new DesmostParser(src);

			assert.throws(() => {
				parser.parse_incantation_arg(Incantation.ArgType.OBJECT);
			});
		})
	})
})
