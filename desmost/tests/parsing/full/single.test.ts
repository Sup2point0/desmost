import { ViewportIncantation } from "../../../src/magic/global/viewport";
import { ColourIncantation } from "../../../src/magic/local/colour";

import { DesmostParser, Ast } from "../../../src/parser";
import { assert_is_expression, assert_is_invocation } from "../shared";


test("/latex", () => {
	let parser = new DesmostParser(`/latex{ y = x^2 }`);
	let r = parser.parse_next() as Ast.Expression;

	assert_is_expression(r);
	// @ts-expect-error: outdated types
	assert.isNotEmpty(r.data.latex);
	// @ts-expect-error: outdated types
	assert.equal(r.data.latex, "y = x^2")
	assert.deepEqual(r.incantations, []);
})

test("/viewport", () => {
	let parser = new DesmostParser(`/viewport{ left: -1, right: 1 }`);
	let r = parser.parse_next();

	assert_is_invocation(r);
	assert.equal(r.kind, Ast.Kind.INCANTATION_INVOCATION);
	assert.deepEqual(r.incantation, new ViewportIncantation());
	assert.deepEqual(r.arg_raw, "left: -1, right: 1");
})

test("/colour", () => {
	let parser = new DesmostParser(`/colour{ BLUE } :: y = x^2`);
	let r = parser.parse_next() as Ast.Expression;

	assert_is_expression(r);
	// @ts-expect-error: outdated types
	assert.equal(r.data.latex, `y = x^2`);
	assert.equal(r.incantations.length, 1);
	
	let invocation = r.incantations[0];
	assert.deepEqual(invocation.incantation, new ColourIncantation());
	assert.equal(invocation.arg_raw, "BLUE")
})
