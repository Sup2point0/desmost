import { DesmostParser, Ast } from "../../src/parser";
import { NO_MATCH } from "../../src/errors";

import {
	ArgIncantation,
	GLOBAL_INCANTATIONS, LOCAL_INCANTATIONS, EXPR_INCANTATIONS,
} from "../../src/magic";

import { assert_is_expression, assert_is_invocation } from "./shared";


describe("try-parse-global-incantation()", () =>
{
	test.each(GLOBAL_INCANTATIONS)
	("without arg", incantation => {
		if (incantation instanceof ArgIncantation) return;
		
		let parser = new DesmostParser(`/${incantation.identifier}`);
		let r = parser.try_parse_global_incantation();
		
		assert_is_invocation(r);
		assert.equal(r.kind, Ast.Kind.INCANTATION_INVOCATION);
		assert.equal(r.incantation, incantation);
	})
	
	test.each(GLOBAL_INCANTATIONS)
	("with arg", incantation => {
		if (incantation instanceof ArgIncantation) return;
		
		let parser = new DesmostParser(`/${incantation.identifier}`);
		let r = parser.try_parse_global_incantation();
		
		assert_is_invocation(r);
		assert.equal(r.kind, Ast.Kind.INCANTATION_INVOCATION);
		assert.equal(r.incantation, incantation);
	})

	test.each(LOCAL_INCANTATIONS)
	("invalid identifier", incantation => {
		let parser = new DesmostParser(`/${incantation.identifier}`);
		let r = parser.try_parse_global_incantation();
		assert.equal(r, NO_MATCH);
	})
})

describe("try-parse-local-incantation()", () =>
{
	test.each(LOCAL_INCANTATIONS)
	("with arg", incantation => {
		if (incantation instanceof ArgIncantation) return;
		
		let parser = new DesmostParser(`/${incantation.identifier}`);
		let r = parser.try_parse_local_incantation();
		
		assert_is_invocation(r);
		assert.equal(r.kind, Ast.Kind.INCANTATION_INVOCATION);
		assert.equal(r.incantation, incantation);
	})

	test.each(EXPR_INCANTATIONS)
	("invalid identifier", incantation => {
		let parser = new DesmostParser(`/${incantation.identifier}`);
		let r = parser.try_parse_local_incantation();
		assert.equal(r, NO_MATCH);
	})
})

describe("try-parse-expr-incantation()", () =>
{
	test.each(EXPR_INCANTATIONS)
	("/expr{ sup }", incantation => {
		if (!(incantation instanceof ArgIncantation)) return;

		let parser = new DesmostParser(`/${incantation.identifier}{ sup }`);
		let r = parser.try_parse_expr_incantation();
		
		assert_is_expression(r);
	})

	test.each(GLOBAL_INCANTATIONS)
	("invalid identifier", incantation => {
		let parser = new DesmostParser(`/${incantation.identifier}`);
		let r = parser.try_parse_expr_incantation();
		assert.equal(r, NO_MATCH);
	})
})
