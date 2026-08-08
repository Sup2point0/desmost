import { DesmostParser, ParseResult } from "../../../src/parser";

import { DesmosIncantation } from "../../../src/magic/global/desmos";

import { ltx } from "../../shared";
import { assert_expression, assert_incantation, assert_parse_blank_line } from "./shared";

import util from "node:util";


// example from /docs/learn-x-in-y.md
const SOURCE = ltx `
/desmos{
  expressions: true,
  settingsMenu: false,
}
/viewport{
  left: -8, right: 8,
}

/text{ Definite Integral Calculator }

/text{ Enter your integrand here: }
/color{ BLUE } :: f(x) = 

/text{ Enter your integration bounds here: }
a = 0
b = 1

/text{ Your answer is: }
\int_{a}^{b} f(x) \ dx

/secret
/fill{
  color: BLUE,
  opacity: 0.2,
}
  :: /latex{
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
  assert.include(r.arg_raw, "expressions: true,");
  assert.include(r.arg_raw, "settingsMenu: false,");
  
  // viewport
  r = parser.parse_next();
  assert_incantation(r);
  assert.equal(r.incantation.identifier, "viewport");
  assert.isDefined(r.arg_raw);
  assert.include(r.arg_raw, "left: -8,");
  assert.include(r.arg_raw, "right: 8,");
  
  assert_parse_blank_line(parser);

  // /text :: Definite Integral Calculator
  r = parser.parse_next();
  assert_expression(r);
  assert.equal(r.data.type, "text", util.inspect(r.data));
  assert.equal(r.data.text, "Definite Integral Calculator");
  assert.deepEqual(r.incantations, []);
});
