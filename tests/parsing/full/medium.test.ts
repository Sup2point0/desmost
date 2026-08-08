import { DesmostParser, ParseResult } from "../../../src/parser";

import { DesmosIncantation } from "../../../src/magic/global/desmos";

import { ltx } from "../../shared";
import { assert_expression, assert_incantation, expect_blank_line } from "./shared";


const SOURCE = ltx `
/desmos{
  expressions: true,
}
/viewport{
  left: -8, right: 8,
}

/text :: Definite Integral Calculator

/text :: Enter your integrand here:
/color{ BLUE } :: f(x) = 

/text :: Enter your integration bounds here:
a = 0
b = 1

/text :: Your answer is:
\int_{a}^{b} f(x) \ dx

/secret
/fill{
  color: BLUE,
  opacity: 0.2,
}
:: /block{
  min(0, f(x))
  \leq y
  \leq max(0, f(x))
}
`.trim();


/**
 * Check parsing of full Desmost programs.
 */
test("medium", () =>
{
  let parser = new DesmostParser(SOURCE);

  let r: ParseResult;
  
  // desmos
  r = parser.parse_next();
  assert_incantation(r);
  assert.deepEqual(r.incantation, new DesmosIncantation());
  assert.isDefined(r.arg_raw);
  assert.equal(r.arg_raw.trim(), "expressions: true,");
  
  // viewport
  r = parser.parse_next();
  assert_incantation(r);
  assert.equal(r.incantation.identifier, "viewport");
  assert.isDefined(r.arg_raw);
  assert.equal(r.arg_raw.trim(), "left: -8, right: 8,");
  
  expect_blank_line(parser);

  // /text :: Definite Integral Calculator
  r = parser.parse_next();
  assert_expression(r);
});
