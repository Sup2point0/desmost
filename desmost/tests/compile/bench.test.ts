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
  let { duration } = compile(desmos, MEDIUM, { debug: true })!;

  assert.isNumber(duration);
  assert.isAbove(duration, 0);

  assert.isBelow(duration, 1000);
  assert.isBelow(duration, 100);
  assert.isBelow(duration, 10);
  
  console.log(duration);
});
