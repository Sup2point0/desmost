import { DesmostParser, ParseResult } from "../../../src/parser";

import { DesmosIncantation } from "../../../src/magic/global/desmos";

import { ltx } from "../../shared";
import { assert_is_expression, assert_is_incantation, assert_parses_blank_line } from "../shared";


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
/colour{ BLUE } :: f(x) =

/text{ Enter your integration bounds here: }
a = 0
b = 1

/text{ Your answer is: }
\int_{a}^{b} f(x) \ dx

/secret
/colour { BLUE }
/no-line
/fill{ opacity: 0.2 }
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
  assert_is_incantation(r);
  assert.deepEqual(r.incantation, new DesmosIncantation());
  assert.isDefined(r.arg_raw);
  assert.include(r.arg_raw, "expressions: true,");
  assert.include(r.arg_raw, "settingsMenu: false,");
  
  // viewport
  r = parser.parse_next();
  assert_is_incantation(r);
  assert.equal(r.incantation.identifier, "viewport");
  assert.isDefined(r.arg_raw);
  assert.include(r.arg_raw, "left: -8,");
  assert.include(r.arg_raw, "right: 8,");
  
  assert_parses_blank_line(parser);

  // /text{ Definite Integral Calculator }
  r = parser.parse_next();
  assert_is_expression(r);
  assert.equal(r.data.type, "text");
  // @ts-expect-error: outdated types
  assert.equal(r.data.text, "Definite Integral Calculator");
  assert.deepEqual(r.incantations, []);

  assert_parses_blank_line(parser);

  // /text{ Enter your integrand here: }
  r = parser.parse_next();
  assert_is_expression(r);
  assert.equal(r.data.type, "text");
  // @ts-expect-error: outdated types
  assert.equal(r.data.text, "Enter your integrand here:");
  assert.deepEqual(r.incantations, []);

  // /colour{ BLUE } :: f(x) =
  r = parser.parse_next();
  assert_is_expression(r);
  // @ts-expect-error: outdated types
  assert.equal(r.data.latex, `f(x) =`);
  assert.equal(r.incantations.length, 1);
});
