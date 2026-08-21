import { compile } from "../../../src";

import { ltx, testing_desmos } from "../../shared";
import { assert_no_errors } from "../shared";
import { MEDIUM } from "../../cases/medium";


describe("medium", () =>
{
  test("compiles without errors", () => {
    let desmos = testing_desmos();
    compile(desmos, MEDIUM);
    assert_no_errors(desmos);
  });
  
  test("compiles correctly", () => {
    let desmos = testing_desmos();
    compile(desmos, MEDIUM);
    let exprs = desmos.getExpressions();

    let i = 0;
    assert.equal(exprs[i++].type, "text");
    assert.equal(exprs[i++].latex, ` `);
    assert.equal(exprs[i++].type, "text");
    assert.equal(exprs[i++].latex, ltx `f\left(x\right) =`);
    assert.equal(exprs[i++].latex, ` `);
    assert.equal(exprs[i++].type, "text");
    assert.equal(exprs[i++].latex, ltx `a = 0`);
    assert.equal(exprs[i++].latex, ltx `b = 1`);
    assert.equal(exprs[i++].latex, ` `);
    assert.equal(exprs[i++].type, "text");
    assert.equal(exprs[i++].latex, ltx `\int_{a}^{b} f\left(x\right) \ dx`);
    assert.equal(exprs[i++].latex, ` `);
    assert.equal(exprs[i++].latex, ltx `min\left(0,\ f\left(x\right)\right) \leq y \leq max\left(0,\ f\left(x\right)\right)`);
    assert.equal(exprs[i++], undefined);
  });
})
