import { DesmostParser } from "../../src/parser";


function run_test([src, expected]: string[])
{
  expected ??= "<NO EXPECTED CASE PROVIDED>";
  
  let parser = new DesmostParser(src);
  let r = parser.parse_arg();
  assert.equal(r.trim(), expected);
  assert.equal(r, expected);
}


describe("parse-arg()", () =>
{
  describe("omitted", () =>
  {
    test("empty", () => {
      let parser = new DesmostParser(`{}`);
      let r = parser.parse_arg();
      assert.equal(r, "");
    });

    test.for([
      `{ }`,
      `{  }`,
      `{\n}`,
      `{ \n}`,
      `{\n }`,
      `{ \n }`,
      `{\n\n}`,
      `{ \n \n }`,
      `{ \n \r\n }`,
    ])
    ("whitespace", src => run_test([src, ""]));
  });

  describe("string", () =>
  {
    test.for([
      `{sup}`,
      `{sup }`,
      `{ sup}`,
      `{ sup }`,
      `{\nsup\n}`,
      `{\n  sup\n}`,
    ])
    (`"sup"`, src => run_test([src, "sup"]));
  });

  describe("object", () =>
  {
    test.for([
      [`{x: 1}`,           `x: 1`],
      [`{x: 1 }`,          `x: 1`],
      [`{ x: 1}`,          `x: 1`],
      [`{ x: 1 }`,         `x: 1`],
      [`{ x: 1, y: 2 }`,   `x: 1, y: 2`],
      [`{ sup: 2.0 }`,     `sup: 2.0`],
      [`{ sup: "world" }`, `sup: "world"`],
    ])
    ("flat", run_test);

    test.for([
      [`{obj:{x:1}}`,       `obj:{x:1}`],
      [`{ obj: { x: 1 }}`,  `obj: { x: 1 }`],
      [`{ obj: { x: 1 } }`, `obj: { x: 1 }`],
    ])
    ("nested", run_test);

    test.for([
      [`{ diabolical: 'error}' }`, `diabolical: 'error}'`],
      [`{ diabolical: "error}" }`, `diabolical: "error}"`],
    ])
    ("with } in string", run_test);
  });
});
