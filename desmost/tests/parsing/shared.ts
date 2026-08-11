import util from "node:util";

import { DesmostParser, Ast } from "../../src/parser";


export function assert_is_expression(result: Ast): asserts result is Ast.Expression
{
  assert.equal(result.kind, Ast.Kind.EXPRESSION);
}

export function assert_is_incantation(result: Ast): asserts result is Ast.IncantationInvocation
{
  assert.equal(
    result.kind,
    Ast.Kind.INCANTATION_INVOCATION,
    `received: ${util.inspect(result)}`
  );
}


export function assert_parses_blank_line(parser: DesmostParser)
{
  let r = parser.parse_next();
  assert.isNotNull(r);
  assert_is_expression(r);
  // @ts-expect-error: outdated types
  assert.equal(r.data.latex, "");
  assert.deepEqual(r.incantations, []);
}
