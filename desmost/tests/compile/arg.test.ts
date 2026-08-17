import { compile } from "../../src"
import { testing_desmos } from "../shared"
import { assert_no_errors } from "./shared";

test.each([
  `/colour{ BLUE } :: y = x`,
  `/point{ style: DOTTED } :: (0, 0)`,
])
("enum literals", src => {
  let desmos = testing_desmos();
  compile(desmos, src);
  assert_no_errors(desmos);
})
