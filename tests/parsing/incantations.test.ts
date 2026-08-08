import { DarkModeIncantation } from "../../src/magic/global/dark-mode";
import { ViewportIncantation } from "../../src/magic/global/viewport";

import { DesmostParser, ParseResult } from "../../src/parser";


test("/dark", () =>
{
  let parser = new DesmostParser(`/dark`);
  let result = parser.parse_next() as ParseResult.IncantationInstance;

  assert.equal(result.kind, ParseResult.Kind.INCANTATION_INSTANCE);
  assert.deepEqual(result.incantation, new DarkModeIncantation());
});


test("/viewport", () =>
{
  let parser = new DesmostParser(`/viewport{ left: -1, right: 1 }`);
  let result = parser.parse_next() as ParseResult.IncantationInstance;

  assert.equal(result.kind, ParseResult.Kind.INCANTATION_INSTANCE);
  assert.deepEqual(result.incantation, new ViewportIncantation());
  assert.deepEqual(result.arg_raw, "left: -1, right: 1");
});
