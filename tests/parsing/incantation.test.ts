import { DesmostParser, ParseResult } from "../../src/parser";
import { ArgIncantation, GLOBAL_INCANTATIONS } from "../../src/magic";
import { ViewportIncantation } from "../../src/magic/global/viewport";

import { ltx } from "../shared";


describe("try-parse-global-incantation()", () =>
{
  describe("without-data", () =>
  {
    test.for(GLOBAL_INCANTATIONS)(`${GLOBAL_INCANTATIONS.length} cases`, incantation =>
    {
      if (incantation instanceof ArgIncantation) return;
      
      let parser = new DesmostParser(`/${incantation.identifier}`);
      let result = parser.try_parse_global_incantation();
      
      assert.equal(result.kind, ParseResult.Kind.INCANTATION_INSTANCE);
      assert.equal(result.incantation, incantation);
    });
  });
});

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

// describe("try-parse-local-incantation-identifier()", () =>
// {
//   test.for([
//     ltx `slider`,
//     ltx `slider{}`,
//     ltx `slider{ min: 0, max: 1 }`,
//   ])("cases", source =>
//   {
//     let parser = new DesmostParser(source);
//     let incantation = parser.try_parse_incantation_identifier(LOCAL_INCANTATIONS);
//     assert.isTrue(incantation instanceof SliderIncantation);
//   });
// });
