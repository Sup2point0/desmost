import { compile } from "../../../src";

import { ltx, testing_desmos } from "../../shared";
import { assert_no_errors } from "../shared";
import { EASY } from "../../cases/easy";


describe("easy", () =>
{
	test("compiles without errors", () => {
		let desmos = testing_desmos();
		compile(desmos, EASY);
		assert_no_errors(desmos);
	});

	test("compiles correctly", () => {
		let desmos = testing_desmos();
		compile(desmos, EASY);
		let exprs = desmos.getExpressions();
	
		let i = 0;
		assert.equal(exprs[i++].latex, ltx `f\left(0\right) = 0`);
		assert.equal(exprs[i++].latex, ltx `f\left(1\right) = 1`);
		assert.equal(exprs[i++].latex, ltx `f\left(n\right) = f\left(n-1\right) + f\left(n\right)`);
		assert.equal(exprs[i++].latex, ltx ` `);
		assert.equal(exprs[i++].latex, ltx `\frac{1}{10} \sum_{n = 1}^{10} \frac{f\left(n+1\right)}{f\left(n\right)}`);
		assert.equal(exprs[i++], undefined);
	});
})
