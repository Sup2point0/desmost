import { DesmostParser, Ast } from "../../src/parser";
import {
  ArgIncantation,
  GLOBAL_INCANTATIONS, LOCAL_INCANTATIONS, EXPR_INCANTATIONS,
} from "../../src/magic";



describe("try-parse-global-incantation()", () =>
{
  test.each(GLOBAL_INCANTATIONS)
  (`no arg`, incantation =>
  {
    if (incantation instanceof ArgIncantation) return;
    
    let parser = new DesmostParser(`/${incantation.identifier}`);
    let r = parser.try_parse_global_incantation();
    
    assert.equal(r.kind, Ast.Kind.INCANTATION_INVOCATION);
    assert.equal(r.incantation, incantation);
  });
});

describe("try-parse-local-incantation()", () =>
{
  test.each(LOCAL_INCANTATIONS)
  (`no arg`, incantation =>
  {
    if (incantation instanceof ArgIncantation) return;
    
    let parser = new DesmostParser(`/${incantation.identifier}`);
    let r = parser.try_parse_local_incantation();
    
    assert.equal(r.kind, Ast.Kind.INCANTATION_INVOCATION);
    assert.equal(r.incantation, incantation);
  });
});

describe("try-parse-expr-incantation()", () =>
{
  test.each(EXPR_INCANTATIONS)
  (`{ sup }`, incantation =>
  {
    let parser = new DesmostParser(`/${incantation.identifier}{ sup }`);
    let r = parser.try_parse_expr_incantation();
    
    assert.equal(r.kind, Ast.Kind.EXPRESSION);
  });
});
