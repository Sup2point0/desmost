import { compile } from "../../src";

import { PointIncantation } from "../../src/magic/local/point";

import { testing_desmos } from "../shared";
import { assert_no_errors } from "./shared";


describe("enum literals", () =>
{
  test.each([
    `/colour{ BLUE } :: y = x`,
    `/colour{ blue } :: y = x`,
    `/colour{ Blue } :: y = x`,
    `/point{ style: DOTTED } :: (0, 0)`,
    `/point{ style: dotted } :: (0, 0)`,
    `/point{ style: Dotted } :: (0, 0)`,
  ])
  ("good", src => {
    let desmos = testing_desmos();
    compile(desmos, src);
    assert_no_errors(desmos);
  })
  
  test.each([
    `/colour{ UNKNOWN } :: y = x`,
  ])
  ("bad", src => {
    assert.throws(() => {
      new PointIncantation().evaluate_arg(src)
    });
  })
})
