import { DesmostParser, Ast } from "../../src/parser";

import { ltx } from "../shared";
import { assert_is_expression } from "./shared";


/**
 * Check the parser doesn't mess with LaTeX absent of incantations.
 */
describe("preserves plain LaTeX", () =>
{
	test.each([
		``,
		`\n`,  // FIXME?
	])
	("empty", source =>
	{
		let parser = new DesmostParser(source);
		let r = parser.parse_next();
		
		assert_is_expression(r);
		assert.equal(r.kind, Ast.Kind.EXPRESSION);
		// @ts-expect-error: outdated types
		assert.equal(r.data.latex, " ");
	})

	test.each([
		ltx `y=x`,
		ltx `y = 2x`,
		ltx `y = x^3`,
	])
	("basic", source =>
	{
		let parser = new DesmostParser(source);
		let r = parser.parse_next();
		
		assert_is_expression(r);
		assert.deepEqual((r as Ast.Expression).data, { latex: source })
	})

	test.each([
		ltx `f\left(x\right)=\sin\left(x\right)`,
		ltx `f\left(x\right) = \sin\left(x\right)`,
	])
	("with escapes", source =>
	{
		let parser = new DesmostParser(source);
		let r = parser.parse_next();
		
		assert_is_expression(r);
		assert.deepEqual((r as Ast.Expression).data, { latex: source })
	})
})
