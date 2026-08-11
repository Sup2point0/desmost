import { DesmostParser, Ast } from "../../../src/parser";

import { assert_is_expression } from "../shared";


describe("edge cases", () =>
{
  test("trailing blank", () =>
  {
    let parser = new DesmostParser(`y = x\n`);
    let r: Ast | null;

    parser.parse_next();

    r = parser.parse_next();
    assert.isNotNull(r);
    assert_is_expression(r);
    // @ts-expect-error: outdated types
    assert.equal(r.data.latex, "");
    assert.equal(r.incantations.length, 0);

    r = parser.parse_next();
    assert.isNull(r);
  });
  
  test("trailing blanks", () =>
  {
    let parser = new DesmostParser(`y = x\n\n`);
    let r: Ast | null;

    parser.parse_next();

    r = parser.parse_next();
    assert.isNotNull(r);
    assert_is_expression(r);
    // @ts-expect-error: outdated types
    assert.equal(r.data.latex, "");
    assert.equal(r.incantations.length, 0);

    r = parser.parse_next();
    assert.isNotNull(r);
    assert_is_expression(r);
    // @ts-expect-error: outdated types
    assert.equal(r.data.latex, "");
    assert.equal(r.incantations.length, 0);

    r = parser.parse_next();
    assert.isNull(r);
  });
});
