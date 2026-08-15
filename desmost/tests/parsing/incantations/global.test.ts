import { DesmostParser } from "../../../src/parser"
import { UnrecoverableError } from "../../../src/errors";

import { DesmosIncantation } from "../../../src/magic/global/desmos";
import { ViewportIncantation } from "../../../src/magic/global/viewport";

import { assert_is_invocation, assert_is_invalid } from "../shared";


describe("/desmos", () =>
{
  test("no arg", () => {
    let parser = new DesmostParser(`/desmos`);
    let r = parser.try_parse_global_incantation();
    
    assert_is_invocation(r);
    assert.deepEqual(r.incantation, new DesmosIncantation());
    assert.isUndefined(r.arg_raw);
  })
  
  test("with arg", () => {
    let parser = new DesmostParser(`/desmos{ keypad: false, expressionsCollapsed: true }`);
    let r = parser.try_parse_global_incantation();
    
    assert_is_invocation(r);
    assert.deepEqual(r.incantation, new DesmosIncantation());
    assert.equal(r.arg_raw, "keypad: false, expressionsCollapsed: true");
  })
})

describe("/viewport", () =>
{
  test("no arg", () => {
    let parser = new DesmostParser(`/viewport`);
    let r = parser.try_parse_global_incantation();
    
    assert_is_invalid(r);
    assert.deepEqual(r.incantation, new ViewportIncantation());
    assert.isUndefined(r.arg_raw);
    assert.isTrue(r.error instanceof UnrecoverableError.MissingInput);
  })
  
  test("with arg", () => {
    let parser = new DesmostParser(`/viewport{ left: -1, right: 1 }`);
    let r = parser.try_parse_global_incantation();

    assert_is_invocation(r);
    assert.deepEqual(r.incantation, new ViewportIncantation());
    assert.equal(r.arg_raw, "left: -1, right: 1");
  })
})
