import type { Range } from "./utils";


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
	data?: DesmostError.Data;

	constructor(msg: string | undefined, name: string) {
		super(msg);
      this.name = name;
	}
}

export namespace DesmostError
{
	export interface Data
	{
		msg?:   string
		hint?:  string
		note?:  string
		debug?: string

		show?: {
			text:  string
			span?: Range
		}
	}

	/** The parser unexpectedly reached the end of its source. */
	export class UnexpectedEnd extends DesmostError {
		constructor(override data: Data) { super(data.msg, "Unexpected End of Source"); }
	}

	/** The parser did not receive input that it expected. */
	export class MissingInput extends DesmostError {
		constructor(override data: Data) { super(data.msg, "Missing Input"); }
	}

	/** The parser received input that did not match what it expected. */
	export class UnexpectedInput extends DesmostError {
		constructor(override data: Data) { super(data.msg, "Unexpected Input"); }
	}

	/** The parser received excess input that it did not expect. */
	export class ExcessInput extends DesmostError {
		constructor(override data: Data) { super(data.msg, "Excess Input"); }
	}

	/** An incantation can't be applied here. */
	export class IllegalIncantation extends DesmostError {
		constructor(override data: Data) { super(data.msg, "Illegal Incantation"); }
	}

	/** An incantation's argument is invalid - could be a parsing, evaluation or validation failure. */
	export class InvalidArgument extends DesmostError {
		constructor(override data: Data) { super(data.msg, "Invalid Argument"); }
	}
}

/** Indicates that a function may throw a `DesmostError`. */
export type Fallible<Result>
	= Result
	| Result & { readonly __brand?: unique symbol };
