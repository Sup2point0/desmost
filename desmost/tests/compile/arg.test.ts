import { compile } from "../../src";

import { ColourIncantation } from "../../src/magic/local/colour";

import { testing_desmos } from "../shared";
import { assert_no_errors } from "./shared";


describe("enum literals", () =>
{
  test.each([
    `/colour{ BLUE } :: y = x`,
    `/colour{ blue } :: y = x`,
    `/colour{ Blue } :: y = x`,
  ])
  ("inline", src => {
    let desmos = testing_desmos();
    compile(desmos, src);
    assert_no_errors(desmos);
  })

  test.each([
    `/point{ style: DOTTED } :: (0, 0)`,
    `/point{ style: dotted } :: (0, 0)`,
    `/point{ style: Dotted } :: (0, 0)`,
  ])
  ("keyed (one)", src => {
    let desmos = testing_desmos();
    compile(desmos, src);
    assert_no_errors(desmos);
  })

  test.each([
    `/point{ style: DOTTED } /label{ pos: RIGHT, text: "Test" } :: (0, 0)`,
  ])
  ("keyed (many)", src => {
    let desmos = testing_desmos();
    compile(desmos, src);
    assert_no_errors(desmos);
  })
  
  test.each([
    `/colour{ UNKNOWN } :: y = x`,
  ])
  ("bad", src => {
    assert.throws(() => {
      new ColourIncantation().evaluate_arg(src)
    });
  })
})
