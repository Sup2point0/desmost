import dedent from "dedent";

import { compile } from "../../../src";
import { DEFAULT_OPTIONS } from "../../../src/options";
import * as utils from "../../../src/utils";

import { ltx, testing_desmos } from "../../shared";
import { assert_has_errors } from "../shared";


describe("place-errors", () =>
{
	const SOURCE = dedent(ltx `
		/colour{} :: x
		/colour{} :: x
		/colour{} :: x
	`);

	test("inline", () => {
		let desmos = testing_desmos();
		compile(desmos, SOURCE, { ...DEFAULT_OPTIONS, place_errors: "inline" });
		assert_has_errors(desmos);

		let exprs = desmos.getExpressions();
		for (let [error, expr] of utils.pairing(exprs)) {
			assert.equal(error.type, "text");
			assert.include(error.text, DEFAULT_OPTIONS.error_prefix);
			assert.equal(expr.latex, `x`);
		}
	});

	test("start", () => {
		let desmos = testing_desmos();
		compile(desmos, SOURCE, { ...DEFAULT_OPTIONS, place_errors: "start" });
		assert_has_errors(desmos);

		let exprs = desmos.getExpressions();
		assert.equal(exprs[0].type, "text");
		assert.include(exprs[0].text, DEFAULT_OPTIONS.error_prefix);

		for (let expr of exprs.slice(1)) {
			assert.notEqual(expr.type, "text");
			assert.notInclude(expr.text ?? "", DEFAULT_OPTIONS.error_prefix);
		}
	});

	test("end", () => {
		let desmos = testing_desmos();
		compile(desmos, SOURCE, { ...DEFAULT_OPTIONS, place_errors: "end" });
		assert_has_errors(desmos);

		let exprs = desmos.getExpressions();
		assert.equal(exprs.at(-1).type, "text");
		assert.include(exprs.at(-1).text, DEFAULT_OPTIONS.error_prefix);

		for (let expr of exprs.slice(0, -1)) {
			assert.notEqual(expr.type, "text");
			assert.notInclude(expr.text ?? "", DEFAULT_OPTIONS.error_prefix);
		}
	});
});
