import { GlobalIncantation } from "../src/incantations";
import { Parser } from "../src/parser";

import { ltx } from "./shared";


describe("parse-incantation()", () =>
{
  test.for([
    ltx `viewport`,
    ltx `viewport{}`,
    ltx `viewport{ left: -1, right: 1 }`,
  ])("cases", source => {
    let parser = new Parser(source);
    let incantation = parser.try_parse_any_incantation();

    assert.equal(incantation, GlobalIncantation.VIEWPORT);
  });
});
