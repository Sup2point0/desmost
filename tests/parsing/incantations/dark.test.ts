import { DarkModeIncantation } from "../../../src/magic/global/dark-mode";

import { DesmostParser, ParseResult } from "../../../src/parser";


describe("/dark", () =>
{
  test("parse", () => {
    let parser = new DesmostParser(`/dark`);
    let result = parser.parse_next() as ParseResult.IncantationInstance;

    assert.equal(result.kind, ParseResult.Kind.INCANTATION_INSTANCE);
    assert.deepEqual(result.incantation, new DarkModeIncantation());
  });
});
