import { compile } from "../../../src";
import { DesmostParser, Ast } from "../../../src/parser";

import { assert_parses_blank_line } from "../../parsing/shared";

import { testing_desmos } from "../../shared";


describe("ignore-blank-lines", () =>
{
  test("1 blank", () => {
    const src = `
y = x

y = x^2
    `.trim();

    let desmos = testing_desmos();
    compile(desmos, src, { ignore_blank_lines: true })!;

    let exprs = desmos.getExpressions();
    assert.equal(exprs.length, 2);
    // @ts-expect-error: outdated types
    assert.equal(exprs[0].latex, "y = x");
    // @ts-expect-error: outdated types
    assert.equal(exprs[1].latex, "y = x^2");
  })
  
  test.each([2, 5, 20, 100])("many blanks", n => {
    const src = `
y = x
${"\n".repeat(n)}
y = x^2
    `.trim();

    let desmos = testing_desmos();
    compile(desmos, src, { ignore_blank_lines: true })!;

    let exprs = desmos.getExpressions();
    assert.equal(exprs.length, 2);
    // @ts-expect-error: outdated types
    assert.equal(exprs[0].latex, "y = x");
    // @ts-expect-error: outdated types
    assert.equal(exprs[1].latex, "y = x^2");
  })
  
  test("spliced", n => {
    const src = `
p = 1

q = 2


r = 3
    `.trim();

    let desmos = testing_desmos();
    compile(desmos, src, { ignore_blank_lines: true })!;

    let exprs = desmos.getExpressions();
    assert.equal(exprs.length, 3);
    // @ts-expect-error: outdated types
    assert.equal(exprs[0].latex, "p = 1");
    // @ts-expect-error: outdated types
    assert.equal(exprs[1].latex, "q = 2");
    // @ts-expect-error: outdated types
    assert.equal(exprs[2].latex, "r = 3");
  })
})

// describe("ignore-trailing-blanks", () =>
// {
//   test("trailing blank", () => {
//     let parser = new DesmostParser(`y = x\n`, { ignore_trailing_blanks: true });
//     let r: Ast | null;

//     parser.parse_next();
//     r = parser.parse_next();
//     assert.isNull(r);
//   })

//   test("trailing blanks", () => {
//     let parser = new DesmostParser(`y = x\n\n`, { ignore_trailing_blanks: true });
//     let r: Ast | null;

//     parser.parse_next();
//     r = parser.parse_next();
//     assert.isNull(r);
//   })
// })
