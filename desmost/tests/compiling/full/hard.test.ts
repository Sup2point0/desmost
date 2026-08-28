import { compile } from "../../../src";

import { ltx, testing_desmos } from "../../shared";
import { assert_no_errors } from "../shared";
import { HARD } from "../../cases/hard";


describe("medium", () =>
{
	test("compiles without errors", () => {
		let desmos = testing_desmos();
		compile(desmos, HARD);
		assert_no_errors(desmos);
	});
	
	test("compiles correctly", () => {
		let desmos = testing_desmos();
		compile(desmos, HARD);

		let exprs = desmos.getExpressions();

		let i = 0;
		assert.equal(exprs[i].type, "text");
		assert.equal(exprs[i].text, "This content\n  is really weirdly formatted");

		i++;
		assert.equal(exprs[i].latex, ` `);

		i++;
		assert.equal(exprs[i].type, "expression");
		assert.equal(exprs[i].latex, ltx `\left\{ 0<x:\ 1,\ 0 \right\}`);

		i++;
		assert.equal(exprs[i].latex, ` `);

		i++;
		assert.equal(exprs[i].latex, ltx `\left(0,\ 0\right)`);
		assert.equal(exprs[i].label, ` } should not close the block`);
		assert.equal(exprs[i].labelOrientation, "RIGHT");
	});
})
