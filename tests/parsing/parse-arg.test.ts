import { DesmostParser } from "../../src/parser";
import { Incantation } from "../../src/magic";

import { matrix } from "../shared";


const ARG_TYPES = [
  Incantation.ArgType.STRING,
  Incantation.ArgType.LATEX,
  Incantation.ArgType.OBJECT,
];


function run_test(
  arg_type: Incantation.ArgType,
  [src, expected]: string[],
)
{
  expected ??= "<NO EXPECTED CASE PROVIDED>";

  let parser = new DesmostParser(src);
  let r = parser.parse_arg(arg_type);
  assert.equal(r.trim(), expected);
  assert.equal(r, expected);
}


describe("parse-arg()", () =>
{
  describe("omitted", () =>
  {
    test.each(ARG_TYPES)
    ("empty", arg_type => {
      let parser = new DesmostParser(`{}`);
      let r = parser.parse_arg(arg_type);
      assert.equal(r, "");
    });

    test.each(matrix(
      ARG_TYPES,
      [
        `{ }`,
        `{  }`,
        `{\n}`,
        `{ \n}`,
        `{\n }`,
        `{ \n }`,
        `{\n\n}`,
        `{ \n \n }`,
        `{ \n \r\n }`,
      ].map(src => [src, ""])
    ))
    ("whitespace", run_test);
  });

  describe("string", () =>
  {
    test.each(matrix(
      [
        Incantation.ArgType.STRING,
        Incantation.ArgType.LATEX,
      ], [
        `{sup}`,
        `{sup }`,
        `{ sup}`,
        `{ sup }`,
        `{\nsup\n}`,
        `{\n  sup\n}`,
      ].map(src => [src, "sup"])
    ))
    (`"sup"`, run_test);
    
    test.each(matrix([
      Incantation.ArgType.STRING,
      Incantation.ArgType.LATEX,
    ], [
      [`{ don't track }`, `don't track`],
    ]))
    (`with quotes`, run_test);
  });

  describe("object", () =>
  {
    test.each(matrix([Incantation.ArgType.OBJECT], [
      [`{x: 1}`,           `x: 1`],
      [`{x: 1 }`,          `x: 1`],
      [`{ x: 1}`,          `x: 1`],
      [`{ x: 1 }`,         `x: 1`],
      [`{ x: 1, y: 2 }`,   `x: 1, y: 2`],
      [`{ sup: 2.0 }`,     `sup: 2.0`],
      [`{ sup: "world" }`, `sup: "world"`],
    ]))
    ("flat", run_test);

    test.each(matrix([Incantation.ArgType.OBJECT], [
      [`{obj:{x:1}}`,       `obj:{x:1}`],
      [`{ obj: { x: 1 }}`,  `obj: { x: 1 }`],
      [`{ obj: { x: 1 } }`, `obj: { x: 1 }`],
    ]))
    ("nested", run_test);

    test.each(matrix([Incantation.ArgType.OBJECT], [
      [`{ diabolical: '{error' }`, `diabolical: '{error'`],
      [`{ diabolical: "{error" }`, `diabolical: "{error"`],
    ]))
    ("with { in string", run_test);

    test.each(matrix([Incantation.ArgType.OBJECT], [
      [`{ diabolical: 'error}' }`, `diabolical: 'error}'`],
      [`{ diabolical: "error}" }`, `diabolical: "error}"`],
    ]))
    ("with } in string", run_test);
  });
});
