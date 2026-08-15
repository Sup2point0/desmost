/**
 * Very rudimentary performance tests for Desmost.
 * 
 * Obviously regressions are unwanted, but we're not *too* fussed about performance, since input is expected to remain very small.
 * 
 * Of course, these tests are unreliable and can be flaky; we just want a sanity check that it isn't horrifically slow!
 */

import { MEDIUM } from "../cases/medium";

import { compile } from "../../src";

import { desmos } from "../shared";


const TRIALS = 10;


test("medium", () =>
{
  let t_init = performance.now();

  for (let i = 0; i < TRIALS; i++) {
    compile(desmos, MEDIUM);
  }

  let total_duration = performance.now() - t_init;
  let mean_duration = total_duration / TRIALS;

  assert.isNumber(mean_duration);
  assert.isAbove(mean_duration, 0);

  assert.isBelow(mean_duration, 1000);
  assert.isBelow(mean_duration, 100);
  assert.isBelow(mean_duration, 10);
  
  console.log(mean_duration);
})
