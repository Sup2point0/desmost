import { Parser } from "../src/parser";
import { ViewportIncantation } from "../src/magic/incantations/viewport";

import { ltx } from "./shared";


describe("parse-incantation()", () =>
{
  test.for([
    ltx `viewport`,
    ltx `viewport{}`,
    ltx `viewport{ left: -1, right: 1 }`,
  ])("cases", source => {
    let parser = new Parser(source);
    let incantation = parser.try_parse_any_incantation_identifier();

    assert.isTrue(incantation instanceof ViewportIncantation);
  });
});
