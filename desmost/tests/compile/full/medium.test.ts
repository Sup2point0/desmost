import { compile } from "../../../src";

import { testing_desmos } from "../../shared";
import { assert_no_errors } from "../shared";
import { MEDIUM } from "../../cases/medium";


test("medium", () =>
{
  let desmos = testing_desmos();
  compile(desmos, MEDIUM);
  assert_no_errors(desmos);
})
