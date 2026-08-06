import { Parser } from "../src/parser";
import { ViewportIncantation } from "../src/magic/global/viewport";

import { ltx } from "./shared";


describe("try-parse-global-incantation-identifier()", () =>
{
  test.for([
    ltx `viewport`,
    ltx `viewport{}`,
    ltx `viewport{ left: -1, right: 1 }`,
  ])("cases", source => {
    let parser = new Parser(source);
    let incantation = parser.try_parse_global_incantation_identifier();

    assert.isTrue(incantation instanceof ViewportIncantation);
  });
});
