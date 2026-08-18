import { compile } from "../../../src";

import { ltx, matrix, testing_desmos } from "../../shared";


describe("parentheses", () =>
{
  describe("()", () =>
  {
    test.each([
      [`f(x) = x^2`,      ltx `f\left(x\right) = x^2`],
      [`f (x) = x^2`,     ltx `f \left(x\right) = x^2`],
      [`f( x ) = x^2`,    ltx `f\left( x \right) = x^2`],
      [`f ( x ) = x^2`,   ltx `f \left( x \right) = x^2`],
    ])
    ("1 line", (src, expected) => {
      let desmos = testing_desmos();
      compile(desmos, src);

      let exprs = desmos.getExpressions();
      // @ts-expect-error: outdated types
      assert.equal(exprs[0].latex, expected);
    })
    
    test.each([
      [`/latex{ f(\nx\n) = x^2 }`,  ltx `f\left( x \right) = x^2`],
      [`/latex{ f(\n x\n) = x^2 }`, ltx `f\left( x \right) = x^2`],
    ])
    ("multi line", (src, expected) => {
      let desmos = testing_desmos();
      compile(desmos, src);

      let exprs = desmos.getExpressions();
      // @ts-expect-error: outdated types
      assert.equal(exprs[0].latex, expected);
    })
    
    test.each([
      [`(((x)))`,  ltx `\left(\left(\left(x\right)\right)\right)`],
    ])
    ("nested", (src, expected) => {
      let desmos = testing_desmos();
      compile(desmos, src);

      let exprs = desmos.getExpressions();
      // @ts-expect-error: outdated types
      assert.equal(exprs[0].latex, expected);
    })
  })

  test.each([
    `A[1...10]`,
  ])
  ("[]", src => {
    let desmos = testing_desmos();
    compile(desmos, src);

    let exprs = desmos.getExpressions();
    // @ts-expect-error: outdated types
    assert.equal(exprs[0].latex, ltx `A\left[1...10\right]`)
  });
})
