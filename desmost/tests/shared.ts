export const ltx = String.raw;


/** Produce all ordered combinations of `left` and `right` (cartesian product) for testing. */
export function matrix<P,Q>(left: P[], right: Q[]): Array<[P, Q]>
{
  if (left.length === 0 || right.length === 0) {
    throw new Error(`Missing test cases!`);
  }
  
  return left.flatMap(x => right.map(y => [x, y] as [P, Q]));
}


/** Produce a dummy Desmos calculator instance with limited functionality for testing. */
export function testing_desmos(): Desmos.Calculator
{
  let expressions: Desmos.ExpressionState[] = [];

  return {
    getExpressions: () => expressions,
    updateSettings: () => {},
    setMathBounds: () => {},
    setExpression: (expr: Desmos.ExpressionState) => expressions.push(expr),
    setExpressions: (exprs: Desmos.ExpressionState[]) => expressions.push(...exprs),
    removeExpression: () => {},
    graphpaperBounds: {
      mathCoordinates: { left: -10, right: 10, bottom: -10, top: 10 },
    },
  } as unknown as Desmos.Calculator;
}
