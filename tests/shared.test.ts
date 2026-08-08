import { matrix } from "./shared";


describe("matrix", () =>
{
  test("0 -> 0", () => {
    assert.throws(() => matrix([], []));
  });

  test("0 -> 1", () => {
    assert.throws(() => matrix([], [null]));
  });
  
  test("1 -> 0", () => {
    assert.throws(() => matrix([null], []));
  });

  test("1 -> 1", () => {
    let m = matrix([true], [false]);
    assert.deepInclude(m, [true, false]);
  });

  test("1 -> many", () => {
    let m = matrix([1], [4, 5, 6]);
    assert.deepInclude(m, [1, 4]);
    assert.deepInclude(m, [1, 5]);
    assert.deepInclude(m, [1, 6]);
  });

  test("many -> 1", () => {
    let m = matrix([1, 2, 3], [4]);
    assert.deepInclude(m, [1, 4]);
    assert.deepInclude(m, [2, 4]);
    assert.deepInclude(m, [3, 4]);
  });

  test("many -> many", () => {
    let m = matrix([1, 2, 3], [4, 5, 6]);
    assert.deepInclude(m, [1, 4]);
    assert.deepInclude(m, [1, 5]);
    assert.deepInclude(m, [1, 6]);
    assert.deepInclude(m, [2, 4]);
    assert.deepInclude(m, [2, 5]);
    assert.deepInclude(m, [2, 6]);
    assert.deepInclude(m, [3, 4]);
    assert.deepInclude(m, [3, 5]);
    assert.deepInclude(m, [3, 6]);
  });

  test.each(matrix(
    [1, 2, 3],
    [4, 5, 6],
  ))("real", (left, right) => {
    assert.isTrue(left < right);
  });
});
