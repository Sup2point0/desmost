import { DesmostParser, Ast } from "../../src/parser";

import { ltx } from "../shared";


/**
 * Check the parser doesn't mess with LaTeX absent of incantations.
 */
describe("preserves plain LaTeX", () =>
{
  test.for([
    ltx `f\left(x\right)=\sin\left(x\right)`,
  ])("non-empty", source =>
  {
    let parser = new DesmostParser(source);
    let r = parser.parse_next();
    
    assert.isNotNull(r);
    assert.equal(r.kind, Ast.Kind.EXPRESSION);
    assert.deepEqual((r as Ast.Expression).data, { latex: source });
  });

  test.for([
    ltx `\n`,
    ltx `\n`,
  ])("empty", source =>
  {
    let parser = new DesmostParser(source);
    let r = parser.parse_next();
    
    // FIXME
    // assert.isNotNull(result);
    // assert.equal(result.kind, ParseResult.Kind.EXPRESSION);
    // assert.deepEqual((result as ParseResult.Expression).data, { latex: "" });
  });
});
