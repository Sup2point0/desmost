import { DesmostParser } from "../src/parser";
import { GLOBAL_INCANTATIONS } from "../src/magic";
import { ViewportIncantation } from "../src/magic/global/viewport";

import { ltx } from "./shared";


describe("try-parse-global-incantation-identifier()", () =>
{
  test.for([
    ltx `viewport`,
    ltx `viewport{}`,
    ltx `viewport{ left: -1, right: 1 }`,
  ])("cases", source =>
  {
    let parser = new DesmostParser(source);
    let incantation = parser.try_parse_incantation_identifier(GLOBAL_INCANTATIONS);
    assert.isTrue(incantation instanceof ViewportIncantation);
  });
});
