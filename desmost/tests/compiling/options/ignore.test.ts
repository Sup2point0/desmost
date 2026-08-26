import { compile } from "../../../src";

import { testing_desmos } from "../../shared";


describe("ignore-comments", () =>
{
	test("only comment", () => {
		const src = `% sup`.trim();

		let desmos = testing_desmos();
		compile(desmos, src, { ignore_comments: true });
		let exprs = desmos.getExpressions();

		assert.isEmpty(exprs);
	})
	
	test("only comments", () => {
		const src = `
% sup
% soup
% slurp
		`.trim();

		let desmos = testing_desmos();
		compile(desmos, src, { ignore_comments: true });
		let exprs = desmos.getExpressions();

		assert.isEmpty(exprs);
	})
	
	test("mixed", () => {
		const src = `
% sup
y = x
		`.trim();

		let desmos = testing_desmos();
		compile(desmos, src, { ignore_comments: true });
		let exprs = desmos.getExpressions();

		assert.equal(exprs.length, 1);
		assert.equal(exprs[0].latex, `y = x`);
	})
	
	test("interspersed", () => {
		const src = `
y = x
% sup
y = x^2
		`.trim();

		let desmos = testing_desmos();
		compile(desmos, src, { ignore_comments: true });
		let exprs = desmos.getExpressions();

		assert.equal(exprs.length, 2);
		assert.equal(exprs[0].latex, `y = x`);
		assert.equal(exprs[1].latex, `y = x^2`);
	})
	
	test("interspersed + blanks", () => {
		const src = `
y = x

% sup
y = x^2
		`.trim();

		let desmos = testing_desmos();
		compile(desmos, src, { ignore_comments: true });
		let exprs = desmos.getExpressions();

		assert.equal(exprs.length, 3);
		assert.equal(exprs[0].latex, `y = x`);
		assert.equal(exprs[1].latex, ` `);
		assert.equal(exprs[2].latex, `y = x^2`);
	})
})
