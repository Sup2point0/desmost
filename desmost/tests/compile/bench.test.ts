/**
 * Very rudimentary performance tests for Desmost.
 * 
 * Obviously regressions are unwanted, but we're not too fussed about performance, since input is expected to remain very small.
 * 
 * Of course, these tests are unreliable and can be flaky; we just want a sanity check that it isn't horrifically slow!
 */

import { MEDIUM } from "../cases/medium";

import { compile } from "../../src";

import { desmos } from "../shared";


test("medium", () =>
{
  let { time_delta } = compile(desmos, MEDIUM, { debug: true })!;

  assert.isNumber(time_delta);
  assert.isAbove(time_delta, 0);

  assert.isBelow(time_delta, 1000);
  assert.isBelow(time_delta, 100);
  assert.isBelow(time_delta, 10);
  
  console.log(time_delta);
});
