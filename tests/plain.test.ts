import { Parser, ParseResultKind } from "../src/parser";

import { ltx } from "./shared";


/**
 * Check the parser doesn't mess with LaTeX absent of incantations.
 */

describe("preserves plain LaTeX", () =>
{
  test("1 line", () => {
    let source = ltx `f\left(x\right)=\sin\left(x\right)`;
    let parser = new Parser(source);
    let result = parser.parse_next();
    
    assert.isNotNull(result);
    assert.equal(result.kind, ParseResultKind.EXPRESSION);
    assert.equal(result.data, { latex: source });
  });
});
