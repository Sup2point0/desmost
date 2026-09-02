import util from "node:util";

import { DesmostParser, Ast } from "../../src/parser";
import type { NoMatch } from "../../src/errors";


export function is_expr(result: Ast | NoMatch | null): asserts result is Ast.Expression
{
	assert.isNotNull(result);
	
	assert.equal(
		(result as Ast).kind, Ast.Kind.EXPRESSION,
		`received: ${util.inspect(result)}`
	);
}

export function is_invoc(result: Ast | NoMatch | null): asserts result is Ast.IncantationInvocation
{
	assert.isNotNull(result);

	assert.equal(
		(result as Ast).kind, Ast.Kind.INCANTATION_INVOCATION,
		`received: ${util.inspect(result)}`
	);
}


export function parses_block(parser: DesmostParser): Ast
{
	let r = parser.parse_next();
	assert.isDefined(r);

	let { blocks, errors } = r;
	assert.isEmpty(errors);
	assert.isNotEmpty(blocks);

	return blocks[0];
}


export function parses_blank(parser: DesmostParser)
{
	let b = parses_block(parser);
	is_expr(b);
	// @ts-expect-error: assertion type-narrows
	assert.equal(b.data.latex, " ");
	assert.deepEqual(b.incantations, []);
}
