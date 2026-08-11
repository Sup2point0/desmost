export const ltx = String.raw;


/** Produce all ordered combinations of `left` and `right` (cartesian product) for testing. */
export function matrix<P,Q>(left: P[], right: Q[]): Array<[P, Q]>
{
  if (left.length === 0 || right.length === 0) {
    throw new Error(`Missing test cases!`);
  }
  
  return left.flatMap(x => right.map(y => [x, y] as [P, Q]));
}


/** Produce a dummy Desmos calculator instance with no functionality for testing. */
// @ts-expect-error: testing
export const desmos: Desmos.Calculator =
{
  updateSettings: () => {},
  setMathBounds: () => {},
  setExpression: () => {},
  setExpressions: () => {},
  removeExpression: () => {},
};
