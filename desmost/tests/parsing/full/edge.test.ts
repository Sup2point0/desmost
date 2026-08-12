import { DesmostParser, Ast } from "../../../src/parser";

import { assert_is_expression, assert_parses_blank_line } from "../shared";


describe("edge cases", () =>
{
  test("trailing blank", () =>
  {
    let parser = new DesmostParser(`y = x\n`);
    let r: Ast | null;

    parser.parse_next();
    assert_parses_blank_line(parser);

    r = parser.parse_next();
    assert.isNull(r);
  });
  
  test("trailing blanks", () =>
  {
    let parser = new DesmostParser(`y = x\n\n`);
    let r: Ast | null;

    parser.parse_next();
    assert_parses_blank_line(parser);
    assert_parses_blank_line(parser);

    r = parser.parse_next();
    assert.isNull(r);
  });
});
