import { DesmostParser, Ast } from "../../src/parser";
import { NO_MATCH } from "../../src/errors";

import {
	ArgIncantation,
	GLOBAL_INCANTATIONS, LOCAL_INCANTATIONS, EXPR_INCANTATIONS,
} from "../../src/magic";

import { is_expr, is_invoc } from "./shared";


describe("try-parse-incantation<GLOBAL>()", () =>
{
	test.each(Object.values(GLOBAL_INCANTATIONS))
	("without arg", incantation => {
		if (incantation instanceof ArgIncantation) return;
		
		let parser = new DesmostParser(`/${incantation.identifier}`);
		let r = parser.try_parse_incantation(Object.values(GLOBAL_INCANTATIONS));
		
		is_invoc(r);
		assert.equal(r.kind, Ast.Kind.INCANTATION_INVOCATION);
		assert.equal(r.incantation, incantation);
	})
	
	test.each(Object.values(GLOBAL_INCANTATIONS))
	("with arg", incantation => {
		if (incantation instanceof ArgIncantation) return;
		
		let parser = new DesmostParser(`/${incantation.identifier}`);
		let r = parser.try_parse_incantation(Object.values(GLOBAL_INCANTATIONS));
		
		is_invoc(r);
		assert.equal(r.kind, Ast.Kind.INCANTATION_INVOCATION);
		assert.equal(r.incantation, incantation);
	})

	test.each(Object.values(LOCAL_INCANTATIONS))
	("invalid identifier", incantation => {
		let parser = new DesmostParser(`/${incantation.identifier}`);
		let r = parser.try_parse_incantation(Object.values(GLOBAL_INCANTATIONS));
		assert.equal(r, NO_MATCH);
	})
})

describe("try-parse-incantation<LOCAL>()", () =>
{
	test.each(Object.values(LOCAL_INCANTATIONS))
	("with arg", incantation => {
		if (incantation instanceof ArgIncantation) return;
		
		let parser = new DesmostParser(`/${incantation.identifier}`);
		let r = parser.try_parse_incantation(Object.values(LOCAL_INCANTATIONS));
		
		is_invoc(r);
		assert.equal(r.kind, Ast.Kind.INCANTATION_INVOCATION);
		assert.equal(r.incantation, incantation);
	});

	test.each(Object.values(EXPR_INCANTATIONS))
	("invalid identifier", incantation => {
		let parser = new DesmostParser(`/${incantation.identifier}`);
		let r = parser.try_parse_incantation(Object.values(LOCAL_INCANTATIONS));
		assert.equal(r, NO_MATCH);
	});
})

describe("try-parse-expr-incantation()", () =>
{
	test.each(Object.values(EXPR_INCANTATIONS))
	("/expr{ sup }", incantation => {
		if (!(incantation instanceof ArgIncantation)) return;

		let parser = new DesmostParser(`/${incantation.identifier}{ sup }`);
		let r = parser.try_parse_expr_incantation();
		
		is_expr(r);
	})

	test.each(Object.values(GLOBAL_INCANTATIONS))
	("invalid identifier", incantation => {
		let parser = new DesmostParser(`/${incantation.identifier}`);
		let r = parser.try_parse_expr_incantation();
		assert.equal(r, NO_MATCH);
	})
})
