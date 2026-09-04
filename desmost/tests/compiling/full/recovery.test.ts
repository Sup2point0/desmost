import { compile } from "../../../src";

import { testing_desmos } from "../../shared";
import { assert_has_errors } from "../shared";


/**
 * Test that compiling `src` fails gracefully, meaning it still flags errors, but finishes parsing to the end.
 */
function run_test(src: string)
{
	let desmos = testing_desmos();
	compile(desmos, src + "\ndone");
	assert_has_errors(desmos);

	let exprs = desmos.getExpressions();
	assert.equal(exprs.at(-1)!.latex, `done`);
}


describe("excess input", () =>
{
	test.each([
		`/hide extra :: x`,
		`/colour{BLUE} extra :: x`,
		`/line{opacity: 0.5} extra :: x`,
		`/line{opacity: 0.5, extra} extra :: x`,
	])
	("1 line", run_test);
	
	test.each([
		`/hide extra :: x\n/hide :: y`,
		`/hide extra :: x \n/hide :: y`,
		`/hide extra :: x\n /hide :: y`,
		`/hide extra :: x \n /hide :: y`,
		`/hide\nextra :: x`,   `/hide\nextra ::\nx`,
		`/hide \nextra :: x`,  `/hide \nextra ::\nx`,
		`/hide\n extra :: x`,  `/hide\n extra ::\nx`,
		`/hide \n extra :: x`, `/hide \n extra ::\nx`,
		`/hide \n extra :: x`, `/hide \n extra ::\nx`,
	])
	("multi line", run_test);
})

describe("missing input", () =>
{
	test.each([
		`/viewport`,
		`/colour :: x`,
	])
	("1 line", run_test);

	test.each([
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
	])
	("multi line", run_test);
})
