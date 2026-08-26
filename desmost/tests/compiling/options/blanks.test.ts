import dedent from "dedent"

import { compile } from "../../../src";

import { testing_desmos } from "../../shared";


describe("ignore-blank-lines", () =>
{
	describe("ignore", () =>
	{
		test("1 blank", () => {
			const src = dedent`
				y = x

				y = x^2
			`.trim();

			let desmos = testing_desmos();
			compile(desmos, src, { ignore_all_blanks: true })!;
			let exprs = desmos.getExpressions();

			assert.equal(exprs.length, 2);
			assert.equal(exprs[0].latex, `y = x`);
			assert.equal(exprs[1].latex, `y = x^2`);
		});
		
		test.each([2, 5, 20, 100])
		("many blanks", n => {
			const src = dedent`
				y = x
				${"\n".repeat(n)}
				y = x^2
			`.trim();

			let desmos = testing_desmos();
			compile(desmos, src, { ignore_all_blanks: true })!;

			let exprs = desmos.getExpressions();
			assert.equal(exprs.length, 2);
			assert.equal(exprs[0].latex, `y = x`);
			assert.equal(exprs[1].latex, `y = x^2`);
		});
		
		test("spliced", n => {
			const src = dedent`
				p = 1

				q = 2


				r = 3
			`.trim();

			let desmos = testing_desmos();
			compile(desmos, src, { ignore_all_blanks: true })!;

			let exprs = desmos.getExpressions();
			assert.equal(exprs.length, 3);
			assert.equal(exprs[0].latex, `p = 1`);
			assert.equal(exprs[1].latex, `q = 2`);
			assert.equal(exprs[2].latex, `r = 3`);
		})
	})
})


describe("keep-leading-blanks", () =>
{
	describe("ignore", () =>
	{
		test("1 blank", () => {
			let desmos = testing_desmos();
			compile(desmos, `\ny = x`, { keep_leading_blanks: false })!;

			let exprs = desmos.getExpressions();
			assert.equal(exprs.length, 1);
			assert.equal(exprs[0].latex, `y = x`);
		})
		
		test.each([2, 5, 20, 100])
		("many blanks", n => {
			let desmos = testing_desmos();
			compile(desmos, `${"\n".repeat(n)}y = x`, { keep_leading_blanks: false })!;

			let exprs = desmos.getExpressions();
			assert.equal(exprs.length, 1);
			assert.equal(exprs[0].latex, `y = x`);
		})
	})

	describe("keep", () =>
	{
		test("1 blank", () => {
			let desmos = testing_desmos();
			compile(desmos, `\ny = x`, { keep_leading_blanks: true })!;

			let exprs = desmos.getExpressions();
			assert.equal(exprs.length, 2);
			assert.equal(exprs[0].latex, ` `);
			assert.equal(exprs[1].latex, `y = x`);
		})
		
		test.each([2, 5, 20, 100])
		("many blanks", n => {
			let desmos = testing_desmos();
			compile(desmos, `${"\n".repeat(n)}y = x`, { keep_leading_blanks: true })!;

			let exprs = desmos.getExpressions();
			assert.equal(exprs.length, 1 + n);
			
			for (let i = 0; i < n; i++) {
				assert.equal(exprs[i].latex, ` `);
			}
			
			assert.equal(exprs[n].latex, `y = x`);
		})
	})
})


describe("keep-trailing-blanks", () =>
{
	describe("ignore", () =>
	{
		test("1 blank", () => {
			let desmos = testing_desmos();
			compile(desmos, `y = x\n`, { keep_trailing_blanks: false })!;

			let exprs = desmos.getExpressions();
			assert.equal(exprs.length, 1);
			assert.equal(exprs[0].latex, `y = x`);
		})
		
		test.each([2, 5, 20, 100])
		("many blanks", n => {
			let desmos = testing_desmos();
			compile(desmos, `y = x${"\n".repeat(n)}`, { keep_trailing_blanks: false })!;

			let exprs = desmos.getExpressions();
			assert.equal(exprs.length, 1);
			assert.equal(exprs[0].latex, `y = x`);
		})
	})

	describe("keep", () =>
	{
		test("1 blank", () => {
			let desmos = testing_desmos();
			compile(desmos, `y = x\n`, { keep_trailing_blanks: true })!;

			let exprs = desmos.getExpressions();
			assert.equal(exprs.length, 2);
			assert.equal(exprs[0].latex, `y = x`);
			assert.equal(exprs[1].latex, ` `);
		})
		
		test.each([2, 5, 20, 100])
		("many blanks", n => {
			let desmos = testing_desmos();
			compile(desmos, `y = x${"\n".repeat(n)}`, { keep_trailing_blanks: true })!;

			let exprs = desmos.getExpressions();
			assert.equal(exprs.length, 1 + n);
			assert.equal(exprs[0].latex, `y = x`);

			for (let i = 1; i < n; i++) {
				assert.equal(exprs[i].latex, ` `);
			}
		})
	})
})
