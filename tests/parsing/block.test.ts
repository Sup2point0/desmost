import { DesmostParser, ParseResult } from "../../src/parser";

import { ltx } from "../shared";
import { assert_is_expression } from "./shared";


describe("parse-next", () =>
{
  test.each([
    `/hide :: y = x^2`,
    `/hide\n:: y = x^2`,
    `/hide\n  :: y = x^2`,
    `/hide \n:: y = x^2`,
    `/hide\n\n:: y = x^2`,
  ])
  ("line breaks", src => {
    let parser = new DesmostParser(src);
    let r = parser.parse_next();
    assert_is_expression(r);
    assert.equal(r.data.latex, `y = x^2`);
  });
});
