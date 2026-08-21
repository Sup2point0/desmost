import { compile } from "../../../src";

import { ltx, testing_desmos } from "../../shared";


function test_cases(name: string, cases: Array<[src: string, expected: string]>)
{
	test.each(cases)(name, (src, expected) => {
		let desmos = testing_desmos();
		compile(desmos, src);

		let exprs = desmos.getExpressions();
		// @ts-expect-error: outdated types
		assert.equal(exprs[0].latex, expected);
	});
}


function preserve(cases: string[]): Array<[src: string, expected: string]>
{
	return cases.map(src => [src, src]);
}


describe("parentheses", () =>
{
	describe("()", () =>
	{
		describe("replace", () =>
		{
			test_cases("1 line", [
				[`f(x) = x^2`,    ltx`f\left(x\right) = x^2`],
				[`f (x) = x^2`,   ltx`f \left(x\right) = x^2`],
				[`f( x ) = x^2`,  ltx`f\left( x \right) = x^2`],
				[`f ( x ) = x^2`, ltx`f \left( x \right) = x^2`],
			]);
			
			test_cases("multi line", [
				[`/latex{ f(\nx\n) = x^2 }`,  ltx`f\left( x \right) = x^2`],
				[`/latex{ f(\n x\n) = x^2 }`, ltx`f\left( x \right) = x^2`],
			]);
			
			test_cases("nested", [
				[`(((x)))`, ltx`\left(\left(\left(x\right)\right)\right)`],
			]);
		});

		describe("preserve", () =>
		{
			test_cases("1 line", preserve([
				ltx`\left(`,
				ltx`\right)`,
				ltx`\left(\right)`,
				ltx`\left(x\right)`,
				ltx`f\left(x\right)`,
				ltx`f \left(x\right)`,
				ltx`f\left( x \right)`,
				ltx`f \left( x \right)`,
			]));
		})
	})

	describe("[]", () =>
	{
		test_cases("1 line", [
			[`A[1...10]`, ltx`A\left[1...10\right]`],
		]);
	})

	describe("{}", () =>
	{
		describe("replace", () =>
		{
			test_cases("1 line", [
				[ltx`\{ 0 < x \}`, ltx`\left\{ 0 < x \right\}`],
			]);
		})
		
		describe("preserve", () =>
		{
			test_cases("1 line", preserve([
				ltx`\left\{`,
				ltx`\right\}`,
				ltx`\left\{\right\}`,
			]));
		})
	})
})
