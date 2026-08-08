import { DesmostParser, ParseResult } from "../../../src/parser";


export function assert_expression(result: ParseResult): asserts result is ParseResult.Expression
{
  assert.equal(result.kind, ParseResult.Kind.EXPRESSION);
}

export function assert_incantation(result: ParseResult): asserts result is ParseResult.IncantationInstance
{
  assert.equal(result.kind, ParseResult.Kind.INCANTATION_INSTANCE);
}


export function expect_blank_line(parser: DesmostParser)
{
  let r = parser.parse_next();
  assert_expression(r);
  assert.equal(r.data.type, "expression");
  assert.equal(r.data.latex, "");
}
