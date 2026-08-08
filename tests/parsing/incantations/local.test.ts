import { DesmostParser, ParseResult } from "../../../src/parser";

import { DesmosColour } from "../../../src/desmos";

import { ColourIncantation } from "../../../src/magic/local/colour";

import { assert_is_expression } from "../shared";


describe("/colour", () =>
{
  test.each([
    `RED`,
    `BLUE`,
    `GREEN`,
    `PURPLE`,
    `ORANGE`,
    `BLACK`,
  ])
  ("plain", col => {
    let parser = new DesmostParser(`/colour{ ${col} } :: y = x^2`);
    let r = parser.parse_next() as ParseResult.Expression;

    assert_is_expression(r);
    // @ts-expect-error: outdated types
    assert.equal(r.data.latex, `y = x^2`);
    assert.equal(r.incantations.length, 1);
    
    let use = r.incantations[0];
    assert.deepEqual(use.incantation, new ColourIncantation());
    assert.equal(use.arg_raw, col)
  });
});
