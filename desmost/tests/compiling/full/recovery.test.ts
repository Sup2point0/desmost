import { compile } from "../../../src";

import { testing_desmos } from "../../shared";
import { assert_has_errors } from "../shared";


/**
 * Test that compiling `src` fails gracefully, meaning it still flags errors, but finishes parsing to the end.
 */
function test_cases(name: string, cases: string[])
{
	test.each(cases)(name, src => {
		let desmos = testing_desmos();
		compile(desmos, src + "\ndone");
		assert_has_errors(desmos);

		let exprs = desmos.getExpressions();
		assert.equal(exprs.at(-1)!.latex, `done`);
	});
}


describe("excess input", () =>
{
	test_cases("1 line", [
		`/hide extra :: x`,
		`/colour{BLUE} extra :: x`,
		`/line{opacity: 0.5} extra :: x`,
		`/line{opacity: 0.5, extra} extra :: x`,
	]);
	
	test_cases("multi line", [
		`/hide extra :: x\n/hide :: y`,
		`/hide extra :: x \n/hide :: y`,
		`/hide extra :: x\n /hide :: y`,
		`/hide extra :: x \n /hide :: y`,
		`/hide\nextra :: x`,   `/hide\nextra ::\nx`,
		`/hide \nextra :: x`,  `/hide \nextra ::\nx`,
		`/hide\n extra :: x`,  `/hide\n extra ::\nx`,
		`/hide \n extra :: x`, `/hide \n extra ::\nx`,
		`/hide \n extra :: x`, `/hide \n extra ::\nx`,
	]);
})

describe("missing input", () =>
{
	test_cases("1 line", [
		`/viewport`,
		`/colour :: x`,
	]);

	test_cases("multi line", [
		`/viewport\nx`,
		`/viewport \nx`,
		`/viewport\n x`,
		`/viewport \n x`,
		`/colour :: x\ny`,
		`/colour /no-line :: x`,
		`/colour\n/no-line :: x`,
		`/colour\n/no-line\n:: x`,
		`/colour \n/no-line\n :: x`,
		`/colour\n /no-line \n:: x`,
		`/colour \n /no-line \n :: x`,
	]);
})
