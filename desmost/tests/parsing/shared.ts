import util from "node:util";

import { DesmostParser, Ast } from "../../src/parser";
import type { NoMatch } from "../../src/errors";


export function assert_is_expression(result: Ast | NoMatch | null): asserts result is Ast.Expression
{
  assert.isNotNull(result);
  
  assert.equal(
    (result as Ast).kind, Ast.Kind.EXPRESSION,
    `received: ${util.inspect(result)}`
  );
}

export function assert_is_invocation(result: Ast | NoMatch | null): asserts result is Ast.IncantationInvocation
{
  assert.isNotNull(result);

  assert.equal(
    (result as Ast).kind, Ast.Kind.INCANTATION_INVOCATION,
    `received: ${util.inspect(result)}`
  );
}

export function assert_is_invalid(result: Ast | NoMatch | null): asserts result is Ast.InvalidInvocation
{
  assert.isNotNull(result);

  assert.equal(
    (result as Ast).kind, Ast.Kind.INVALID_INCANTATION,
    `received: ${util.inspect(result)}`
  );
}


export function assert_parses_blank_line(parser: DesmostParser)
{
  let r = parser.parse_next();
  assert.isNotNull(r);
  assert_is_expression(r);
  // @ts-expect-error: outdated types
  assert.equal(r.data.latex, " ");
  assert.deepEqual(r.incantations, []);
}
