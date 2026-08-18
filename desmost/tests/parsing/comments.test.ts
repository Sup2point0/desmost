import { DesmostParser } from "../../src/parser"
import { assert_is_expression } from "./shared";

describe("%", () =>
{
  test.each([
    [`%`, ``],
    [`% `, ``],
    [`%\n`, ``],
    [`% sup`, `sup`],
    [`%  sup`, `sup`],
  ])
  ("basic", (src, expected) => {
    let parser = new DesmostParser(src);
    let r = parser.parse_next();

    assert_is_expression(r);
    assert.equal(r.data.type, "text");
    // @ts-expect-error
    assert.equal(r.data.text, expected);
  })
})
