import { DesmostParser, Ast } from "../../../src/parser";

import { assert_is_expression, assert_parses_blank_line } from "../shared";


describe("ignore-trailing-blanks", () =>
{
  test("trailing blank", () =>
  {
    let parser = new DesmostParser(`y = x\n`, { ignore_trailing_blanks: true });
    let r: Ast | null;

    parser.parse_next();
    r = parser.parse_next();
    assert.isNull(r);
  });

  test("trailing blanks", () =>
  {
    let parser = new DesmostParser(`y = x\n\n`, { ignore_trailing_blanks: true });
    let r: Ast | null;

    parser.parse_next();
    r = parser.parse_next();
    assert.isNull(r);
  });
});
