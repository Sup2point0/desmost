import { DesmostParser, Ast } from "../../../src/parser";

import { DesmosIncantation } from "../../../src/magic/global/desmos";
import { ColourIncantation } from "../../../src/magic/local/colour";
import { FillIncantation } from "../../../src/magic/local/fill";
import { NoLineIncantation } from "../../../src/magic/local/no-line";
import { SecretIncantation } from "../../../src/magic/local/secret";

import { ltx } from "../../shared";
import { assert_is_expression, assert_is_invocation, assert_parses_blank_line } from "../shared";
import { MEDIUM } from "../../cases/medium";


test("medium", () =>
{
  let parser = new DesmostParser(MEDIUM);
  let r: Ast | null;
  
  // desmos
  r = parser.parse_next();
  assert_is_invocation(r);
  assert.deepEqual(r.incantation, new DesmosIncantation());
  assert.isDefined(r.arg_raw);
  assert.include(r.arg_raw, "expressions: true,");
  assert.include(r.arg_raw, "settingsMenu: false,");
  
  // viewport
  r = parser.parse_next();
  assert_is_invocation(r);
  assert.equal(r.incantation.identifier, "viewport");
  assert.isDefined(r.arg_raw);
  assert.include(r.arg_raw, "left: -8,");
  assert.include(r.arg_raw, "right: 8,");
  
  // /text{ Definite Integral Calculator }
  r = parser.parse_next();
  assert_is_expression(r);
  assert.equal(r.data.type, "text");
  // @ts-expect-error: outdated types
  assert.equal(r.data.text, "Definite Integral Calculator\nv1.0");
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

  assert_parses_blank_line(parser);

  // /text{ Enter your integration bounds here: }
  r = parser.parse_next();
  assert_is_expression(r);
  assert.equal(r.data.type, "text");
  // @ts-expect-error: outdated types
  assert.equal(r.data.text, "Enter your integration bounds here:");
  assert.deepEqual(r.incantations, []);

  // a = 0
  r = parser.parse_next();
  assert_is_expression(r);
  // @ts-expect-error: outdated types
  assert.equal(r.data.latex, `a = 0`);

  // b = 1
  r = parser.parse_next();
  assert_is_expression(r);
  // @ts-expect-error: outdated types
  assert.equal(r.data.latex, `b = 1`);

  assert_parses_blank_line(parser);

  // /text{ Your answer is: }
  r = parser.parse_next();
  assert_is_expression(r);
  assert.equal(r.data.type, "text");
  // @ts-expect-error: outdated types
  assert.equal(r.data.text, "Your answer is:");
  assert.deepEqual(r.incantations, []);

  // \int_{a}^{b} f(x) \ dx
  r = parser.parse_next();
  assert_is_expression(r);
  // @ts-expect-error: outdated types
  assert.equal(r.data.latex, ltx `\int_{a}^{b} f(x) \ dx`);

  assert_parses_blank_line(parser);

  // ...
  r = parser.parse_next();
  assert_is_expression(r);

  // @ts-expect-error: outdated types
  assert.equal(r.data.latex, ltx `
    min(0, f(x))
    \leq y
    \leq max(0, f(x))
    `.trim()
  );

  assert.equal(r.incantations.length, 4);
  assert.deepEqual(r.incantations[0].incantation, new SecretIncantation());
  assert.deepEqual(r.incantations[1].incantation, new ColourIncantation());
  assert.deepEqual(r.incantations[2].incantation, new NoLineIncantation());
  assert.deepEqual(r.incantations[3].incantation, new FillIncantation());
  assert.equal(r.incantations[0].kind, Ast.Kind.INCANTATION_INVOCATION);
  assert.equal(r.incantations[1].kind, Ast.Kind.INCANTATION_INVOCATION);
  assert.equal(r.incantations[2].kind, Ast.Kind.INCANTATION_INVOCATION);
  assert.equal(r.incantations[3].kind, Ast.Kind.INCANTATION_INVOCATION);
  assert.equal(r.incantations[1].arg_raw, "BLUE");
  assert.equal(r.incantations[3].arg_raw, "opacity: 0.2");
})
