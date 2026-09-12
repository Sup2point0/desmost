import { compile } from "../../src";
import * as utils from "../../src/utils";

import { testing_desmos } from "../shared";
import { assert_has_errors } from "./shared";


/**
 * Test that compiling `src` fails gracefully, meaning it still flags errors, but finishes parsing to the end.
 */
function test_cases(...expected_exprs: string[])
{
	return (src: string) =>
	{
		let desmos = testing_desmos();
		compile(desmos, src + "\ndone");
		assert_has_errors(desmos);

		let exprs = desmos.getExpressions();

		assert.equal(exprs.at(-1)!.latex, `done`);

		if (expected_exprs != undefined) {
			let i = 0;

			for (let expr of exprs) {
				if (expr.latex != undefined) {
					assert.equal(expr.latex, expected_exprs[i]);
					i++;
					if (i >= expected_exprs.length) break;
				}
			}
		}
	};
}


describe("excess input", () =>
{
	test.each([
		`/hide extra :: x`,
		`/colour{BLUE} extra :: x`,
		`/line{opacity: 0.5} extra :: x`,
		`/line{opacity: 0.5, extra} extra :: x`,
	])
	("1 line", test_cases(`x`));
	
	test.each([
		`/hide extra :: x\n/hide :: y`,
		`/hide extra :: x \n/hide :: y`,
		`/hide extra :: x\n /hide :: y`,
		`/hide extra :: x \n /hide :: y`,
		`/hide\nextra :: x`,   `/hide\nextra ::\ny`,
		`/hide \nextra :: x`,  `/hide \nextra ::\ny`,
		`/hide\n extra :: x`,  `/hide\n extra ::\ny`,
		`/hide \n extra :: x`, `/hide \n extra ::\ny`,
		`/hide \n extra :: x`, `/hide \n extra ::\ny`,
	])
	("multi line", test_cases(`x`, `y`));
})

describe("missing input", () =>
{
	test.each([
		`/viewport`,
		`/colour :: x`,
	])
	("1 line", test_cases());

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
	("multi line", test_cases(`x`));
})
