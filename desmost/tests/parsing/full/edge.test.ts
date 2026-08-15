import { DesmostParser, Ast } from "../../../src/parser";

import { assert_is_expression, assert_parses_blank_line } from "../shared";


describe("blank lines", () =>
{
  test("inline blank", () => {
    let parser = new DesmostParser(`
y = x

y = x^2
    `.trim());
    let r: Ast | null;

    parser.parse_next();
    assert_parses_blank_line(parser);
    parser.parse_next();
    r = parser.parse_next();
    assert.isNull(r);
  });
  
  test("inline blanks", () => {
    let parser = new DesmostParser(`
y = x


y = x^2
    `.trim());
    let r: Ast | null;

    parser.parse_next();
    assert_parses_blank_line(parser);
    assert_parses_blank_line(parser);
    parser.parse_next();
    r = parser.parse_next();
    assert.isNull(r);
  });

  test("leading blank", () => {
    let parser = new DesmostParser(`\ny = x`);
    let r: Ast | null;

    assert_parses_blank_line(parser);
    parser.parse_next();
    r = parser.parse_next();
    assert.isNull(r);
  });

  test("leading blanks", () => {
    let parser = new DesmostParser(`\n\n\ny = x`);
    let r: Ast | null;

    assert_parses_blank_line(parser);
    assert_parses_blank_line(parser);
    assert_parses_blank_line(parser);
    parser.parse_next();
    r = parser.parse_next();
    assert.isNull(r);
  });

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
    let parser = new DesmostParser(`y = x\n\n\n`);
    let r: Ast | null;

    parser.parse_next();
    assert_parses_blank_line(parser);
    assert_parses_blank_line(parser);
    assert_parses_blank_line(parser);
    r = parser.parse_next();
    assert.isNull(r);
  });
});

describe("spaces", () =>
{
  test("leading spaces", () => {
    let parser = new DesmostParser(`  y = x`);

    let r = parser.parse_next();
    assert_is_expression(r);
    // @ts-expect-error: outdated types
    assert.equal(r.data.latex, "y = x");
  });

  test("leading spaces (with blanks)", () => {
    let parser = new DesmostParser(`\n  y = x`);

    assert_parses_blank_line(parser);
    let r = parser.parse_next();
    assert_is_expression(r);
    // @ts-expect-error: outdated types
    assert.equal(r.data.latex, "y = x");
  });

  test("trailing spaces", () => {
    let parser = new DesmostParser(`y = x  `);

    let r = parser.parse_next();
    assert_is_expression(r);
    // @ts-expect-error: outdated types
    assert.equal(r.data.latex, "y = x");
  });

  test("trailing spaces (with blanks)", () => {
    let parser = new DesmostParser(`\ny = x  \ny = x^2`);
    let r: Ast | null;
    
    assert_parses_blank_line(parser);
    r = parser.parse_next();
    assert_is_expression(r);
    // @ts-expect-error: outdated types
    assert.equal(r.data.latex, "y = x");
    r = parser.parse_next();
    assert_is_expression(r);
    // @ts-expect-error: outdated types
    assert.equal(r.data.latex, "y = x^2");
    r = parser.parse_next();
    assert.isNull(r);
  });
});
