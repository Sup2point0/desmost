import { DesmostParser, Ast } from "../../../src/parser";
import { GLOBAL_INCANTATIONS, LOCAL_INCANTATIONS } from "../../../src/magic";

import { is_expr, is_invoc, parses_block } from "../shared";


test("/latex", () => {
	let parser = new DesmostParser(`/latex{ y = x^2 }`);
	let r = parses_block(parser);

	is_expr(r);
	assert.isNotEmpty(r.data.latex);
	assert.equal(r.data.latex, "y = x^2")
	assert.deepEqual(r.incantations, []);
});

test("/viewport", () => {
	let parser = new DesmostParser(`/viewport{left: -1, right: 1}`);
	let r = parses_block(parser);

	is_invoc(r);
	assert.equal(r.kind, Ast.Kind.INCANTATION_INVOCATION);
	assert.deepEqual(r.incantation, GLOBAL_INCANTATIONS.viewport);
	assert.deepEqual(r.arg_raw, "left: -1, right: 1");
});

test("/colour", () => {
	let parser = new DesmostParser(`/colour{BLUE} :: y = x^2`);
	let r = parses_block(parser);

	is_expr(r);
	assert.equal(r.data.latex, `y = x^2`);
	assert.equal(r.incantations.length, 1);
	
	let invocation = r.incantations[0];
	assert.deepEqual(invocation.incantation, LOCAL_INCANTATIONS.colour);
	assert.equal(invocation.arg_raw, "BLUE")
});
