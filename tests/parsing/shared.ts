import util from "node:util";

import { DesmostParser, ParseResult } from "../../src/parser";


export function assert_is_expression(result: ParseResult): asserts result is ParseResult.Expression
{
  assert.equal(result.kind, ParseResult.Kind.EXPRESSION);
}

export function assert_is_incantation(result: ParseResult): asserts result is ParseResult.IncantationInvocation
{
  assert.equal(
    result.kind,
    ParseResult.Kind.INCANTATION_INVOCATION,
    `received: ${util.inspect(result)}`
  );
}


export function assert_parses_blank_line(parser: DesmostParser)
{
  let r = parser.parse_next();
  assert_is_expression(r);
  // @ts-expect-error: outdated types
  assert.equal(r.data.latex, "");
  assert.deepEqual(r.incantations, []);
}
