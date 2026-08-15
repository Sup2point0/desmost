import { compile } from "../../../src";

import { ltx, testing_desmos } from "../../shared";


describe("parentheses", () =>
{
  test.each([
    `f(x) = x^2`,
    `f (x) = x^2`,
    `f( x ) = x^2`,
    `f ( x ) = x^2`,
  ])
  ("1 line", src => {
    let desmos = testing_desmos();
    compile(desmos, src);

    let exprs = desmos.getExpressions();
    // @ts-expect-error: outdated types
    assert.equal(exprs[0].latex, ltx `f\left(x\right) = x^2`)
  });
})
