export const ltx = String.raw;


/** Produce all ordered combinations of `left` and `right` (cartesian product) for testing. */
export function matrix<P,Q>(left: P[], right: Q[]): Array<[P, Q]>
{
	if (left.length === 0 || right.length === 0) {
		throw new Error(`Missing test cases!`);
	}
	
	return left.flatMap(x => right.map(y => [x, y] as [P, Q]));
}


/**
 * Produce a dummy Desmos calculator instance with limited functionality for testing.
 */
export function testing_desmos(...exprs: Desmos.ExpressionState[]): Desmos.Calculator
{
	let ex: Desmos.ExpressionState[] = exprs;

	function find(expr: Desmos.ExpressionState): number | undefined {
		let idx = ex.findIndex(x => x.id != undefined && x.id === expr.id);
		return idx !== -1 ? idx : undefined;
	}

	return {
		getExpressions: () => ex,

		updateSettings: () => {},

		setMathBounds: () => {},

		setExpression: expr => {
			let i = find(expr);

			if (i != undefined) {
				ex.splice(i, 1, expr);
			} else {
				ex.push(expr);
			}
		},

		setExpressions: exprs => ex.push(...exprs),

		removeExpression: expr => {
			let i = find(expr);
			if (i != undefined) ex.splice(i, 1);
		},

		graphpaperBounds: {
			mathCoordinates: { left: -10, right: 10, bottom: -10, top: 10 },
		},

	} as unknown as Desmos.Calculator;
}
