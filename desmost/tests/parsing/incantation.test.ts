import { DesmostParser, Ast } from "../../src/parser";
import { NO_MATCH } from "../../src/parser/errors";

import {
	ArgIncantation,
	GLOBAL_INCANTATIONS, LOCAL_INCANTATIONS, EXPR_INCANTATIONS,
} from "../../src/magic";

import { is_expr, is_invoc } from "./shared";


describe("global", () =>
{
	test.each(Object.values(GLOBAL_INCANTATIONS))
	("without arg", incantation => {
		if (incantation instanceof ArgIncantation) return;
		
		let parser = new DesmostParser(`/${incantation.identifier}`);
		let r = parser.parse_incantation();
		
		is_invoc(r);
		assert.equal(r.kind, Ast.Kind.INCANTATION_INVOCATION);
		assert.equal(r.incantation, incantation);
	});
	
	test.each(Object.values(GLOBAL_INCANTATIONS))
	("with arg", incantation => {
		if (!(incantation instanceof ArgIncantation)) return;
		
		let parser = new DesmostParser(`/${incantation.identifier}{}`);
		let r = parser.parse_incantation();
		
		is_invoc(r);
		assert.equal(r.kind, Ast.Kind.INCANTATION_INVOCATION);
		assert.equal(r.incantation, incantation);
	});
})

describe("local", () =>
{
	test.each(Object.values(LOCAL_INCANTATIONS))
	("without arg", incantation => {
		if (incantation instanceof ArgIncantation) return;
		
		let parser = new DesmostParser(`/${incantation.identifier}`);
		let r = parser.parse_incantation();
		
		is_invoc(r);
		assert.equal(r.kind, Ast.Kind.INCANTATION_INVOCATION);
		assert.equal(r.incantation, incantation);
	});
	test.each(Object.values(LOCAL_INCANTATIONS))
	("with arg", incantation => {
		if (!(incantation instanceof ArgIncantation)) return;
		
		let parser = new DesmostParser(`/${incantation.identifier}{}`);
		let r = parser.parse_incantation();
		
		is_invoc(r);
		assert.equal(r.kind, Ast.Kind.INCANTATION_INVOCATION);
		assert.equal(r.incantation, incantation);
	});
})

describe("expr", () =>
{
	test.each(Object.values(EXPR_INCANTATIONS))
	("with arg", incantation => {
		if (!(incantation instanceof ArgIncantation)) return;

		let parser = new DesmostParser(`/${incantation.identifier}{}`);
		let r = parser.try_parse_expr_incantation();
		
		is_expr(r);
	})
})
