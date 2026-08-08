import { DarkModeIncantation } from "../../src/magic/global/dark-mode";
import { ViewportIncantation } from "../../src/magic/global/viewport";

import { DesmostParser, ParseResult } from "../../src/parser";


test("/dark", () =>
{
  let parser = new DesmostParser(`/dark`);
  let r = parser.parse_next() as ParseResult.IncantationInstance;

  assert.equal(r.kind, ParseResult.Kind.INCANTATION_INSTANCE);
  assert.deepEqual(r.incantation, new DarkModeIncantation());
});


test("/viewport", () =>
{
  let parser = new DesmostParser(`/viewport{ left: -1, right: 1 }`);
  let r = parser.parse_next() as ParseResult.IncantationInstance;

  assert.equal(r.kind, ParseResult.Kind.INCANTATION_INSTANCE);
  assert.deepEqual(r.incantation, new ViewportIncantation());
  assert.deepEqual(r.arg_raw, "left: -1, right: 1");
});
