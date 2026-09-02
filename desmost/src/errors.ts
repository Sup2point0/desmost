/** The parser failed to parse something (usually during speculative parsing), which only results in internal backtracking. */
export const NO_MATCH = Symbol("no-match");

/** The compiler encountered a non-fatal recoverable failure (usually during speculative parsing), which only results in internal backtracking. */
export type NoMatch = typeof NO_MATCH & { readonly __brand?: unique symbol };


/**
 * The compiler encountered a fatal unrecoverable error, which will reach the end user.
 * 
 * It's not *literally* unrecoverable in the sense that it will crash the compiler completely, but it means there are no further fallbacks to try.
 */
export class DesmostError extends Error
{
	info?: DesmostError.Info;

	constructor(msg: string, name: string) {
		super(msg);
		this.name = name;
	}
}

export namespace DesmostError
{
	export interface Info
	{
		hint?: string,
		note?: string,
		flagged_by?: string,
	}

	/** The parser unexpectedly reached the end of its entire input source code. */
	export class UnexpectedEnd extends DesmostError {
		constructor(msg: string, override info?: Info) { super(msg, "Unexpected End of Input"); }
	}

	/** The parser did not receive input that it expected. */
	export class MissingInput extends DesmostError {
		constructor(msg: string, override info?: Info) { super(msg, "Missing Input"); }
	}

	/** The parser received input that did not match what it expected. */
	export class UnexpectedInput extends DesmostError {
		constructor(msg: string, override info?: Info) { super(msg, "Unexpected Input"); }
	}

	/** The parser received excess input that it did not expect. */
	export class ExcessInput extends DesmostError {
		constructor(msg: string, override info?: Info) { super(msg, "Excess Input"); }
	}

	/** An incantation can't be applied here. */
	export class IllegalIncantation extends DesmostError {
		constructor(msg: string, override info?: Info) { super(msg, "Illegal Incantation"); }
	}

	/** An incantation's argument is invalid - could be a parsing, evaluation or validation failure. */
	export class InvalidArgument extends DesmostError {
		constructor(msg: string, override info?: Info) { super(msg, "Invalid Argument"); }
	}
}

/** Indicates that a function may throw an `DesmostError`. */
export type Unrecoverable<Result>
	= Result
	| Result & { readonly __brand?: unique symbol };
