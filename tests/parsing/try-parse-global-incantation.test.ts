import { DesmostParser, ParseResult } from "../../src/parser";
import { DataIncantation, GLOBAL_INCANTATIONS } from "../../src/magic";


describe("try-parse-global-incantation()", () =>
{
  describe("without-data", () =>
  {
    test.for(GLOBAL_INCANTATIONS)(`${GLOBAL_INCANTATIONS.length} cases`, incantation =>
    {
      if (incantation instanceof DataIncantation) return;
      
      let parser = new DesmostParser(`/${incantation.identifier}`);
      let result = parser.try_parse_global_incantation();
      
      assert.equal(result.kind, ParseResult.Kind.INCANTATION);
      assert.equal(result.incantation, incantation);
    });
  });
});
