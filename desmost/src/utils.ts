export const LINE = '—'.repeat(10);


/**
 * Is `expr` a Desmos LaTeX expression (as opposed to a note or table)?
 */
export function is_latex(expr: Desmos.ExpressionState): expr is Desmos.Expression
{
	return (expr.type === undefined || expr.type === "expression");
}


export function* reversing<T>(items: ArrayLike<T>): Generator<T>
{
	for (let i = items.length - 1; i >= 0; i--) {
		yield items[i];
	}
}

export function paired<T>(items: Iterable<T>): Array<[left: T, right: T]>
{
	return pairing(items).toArray();
}

export function* pairing<T>(items: Iterable<T>): Generator<[left: T, right: T]>
{
	let previous = null;

	for (let item of items) {
		if (previous === null) {
			previous = item;
			continue;
		}
		else {
			yield [previous, item];
			previous = null;
		}
	}

	if (previous !== null) {
		return previous;
	}
}


export function chars(s: string, start?: number, stop?: number): string[]
{
	return new Range(start ?? 0, stop ?? s.length).map(i => s[i]).toArray();
}


export class Range
{
	/** The lower bound of the range (inclusive). */
	public readonly start: number;

	/** The upper bound of the range (exclusive). */
	public readonly stop: number;

	constructor(
		start: number, 
		stop: number,
	)
	{
		this.start = Math.min(start, stop);
		this.stop  = Math.max(start, stop);
	}

	get length(): number {
		return this.stop - this.start + 1;
	}

	*map<T>(callback: (n: number) => T): Generator<T>
	{
		for (let n = this.start; n < this.stop; n++) {
			yield callback(n);
		}
	}
}
