import { DarkModeIncantation } from "../../src/magic/global/dark-mode";
import { ViewportIncantation } from "../../src/magic/global/viewport";
import { LatexIncantation } from "../../src/magic/expr/latex";
import { TextIncantation } from "../../src/magic/expr/text";

import { DesmostParser, Ast } from "../../src/parser";
import { assert_is_expression } from "./shared";


test("/dark", () =>
{
  let parser = new DesmostParser(`/dark`);
  let r = parser.parse_next() as Ast.IncantationInvocation;

  assert.equal(r.kind, Ast.Kind.INCANTATION_INVOCATION);
  assert.deepEqual(r.incantation, new DarkModeIncantation());
});


test("/viewport", () =>
{
  let parser = new DesmostParser(`/viewport{ left: -1, right: 1 }`);
  let r = parser.parse_next() as Ast.IncantationInvocation;

  assert.equal(r.kind, Ast.Kind.INCANTATION_INVOCATION);
  assert.deepEqual(r.incantation, new ViewportIncantation());
  assert.deepEqual(r.arg_raw, "left: -1, right: 1");
});


describe("/latex", () =>
{
  test("easy", () =>
  {
    let parser = new DesmostParser(`/latex{ y = x^2 }`);
    let r = parser.parse_next() as Ast.Expression;

    assert_is_expression(r);
    // @ts-expect-error: outdated types
    assert.isNotEmpty(r.data.latex);
    // @ts-expect-error: outdated types
    assert.equal(r.data.latex, "y = x^2")
    assert.deepEqual(r.incantations, []);
  });
});
