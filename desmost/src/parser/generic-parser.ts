import { NO_MATCH, DesmostError } from "../errors";
import type { NoMatch, Fallible } from "../errors";


const IGNORED_CHARACTERS = new Set([
	'\r',
]);


/**
 * A stateful lazy parser, providing core (non-Desmost-specific) methods for parsing.
 * 
 * Many methods come in `<verb>` and `try_<verb>` pairs. On parsing failure, the former throws an `DesmostError`, but the latter instead backtracks and only returns a `NoMatch`. The former is for expected parses, while the latter is for speculative parsing.
 */
export class GenericParser
{
	/** The source code to parse. */
	protected readonly source: string

	/** The current position in the source code the parser is pointing to. */
	protected i: number = 0

	/** The number of characters in the source code. */
	protected readonly length: number

	/** Accumulated errors in the current block being parsed. */
	errors: DesmostError[]


	/** Create a parser for parsing `source`. */
	constructor(source: string)
	{
		this.source = source;
		this.length = source.length;
		this.errors = [];
	}


	/**
	 * Is the parser currently pointing at an invalid character?
	 */
	protected out_of_bounds(): boolean
	{
		return this.i >= this.length;
	}

	/**
	 * Get the character the parser is currently pointing at, or `undefined` if the parser is out-of-bounds.
	 */
	protected get current(): string | undefined
	{
		return this.source.at(this.i);
	}

	protected peek(): string | undefined
	{
		return this.source.at(this.i + 1);
	}

	/**
	 * Peek the rest of the content in the current line.
	 */
	protected peek_line(): string
	{
		return this.source.slice(this.i, this.source.indexOf("\n", this.i));
	}

	/**
	 * Peek a snippet of the upcoming source text for display purposes.
	 * 
	 * Optionally start from the given `idx`.
	 */
	public preview(idx?: number): string
	{
		idx ??= this.i;

		return (
			this.source.slice(idx, idx + 20).replaceAll("\n", " ")
			+ (idx + 20 >= this.length ? "⏎" : "...")
		);
	}

	/**
	 * Advance to the next character, skipping ignored characters.
	 * 
	 * Errors if the parser is already out-of-bounds *before* advancing.
	 */
	protected advance(error_data?: DesmostError.Data): Fallible<void>
	{
		if (this.out_of_bounds()) {
			throw new DesmostError.UnexpectedEnd(error_data ?? {});
		}

		this.#advance();
	}

	/**
	 * Attempt to advance to the next character, skipping ignored characters.
	 * 
	 * Fails if the parser is the out-of-bounds *before* advancing.
	 */
	protected try_advance(): void | NoMatch
	{
		if (this.out_of_bounds()) return NO_MATCH;
		this.#advance();
	}

	#advance(): void
	{
		this.i++;

		// @ts-expect-error: `this.current == undefined` is a true negative
		if (IGNORED_CHARACTERS.has(this.current)) {
			this.advance();
		}
	}

	/**
	 * Consume `raw`, erroring if `raw` was not found.
	 */
	protected consume(raw: string, error_data?: DesmostError.Data): Fallible<void>
	{
		if (this.out_of_bounds()) {
			throw new DesmostError.UnexpectedEnd({
				msg: `While trying to consume: \`${raw}\``,
				show: {
					text: this.preview(this.i - 5),
				}
			});
		}

		let init = this.i;
		let ii = 0;

		while (this.current === raw[ii]) {
			this.advance({
				msg: `While trying to consume: \`${raw}\``,
				show: {
					text: `\`${this.preview(init)}\``,
				},
			});

			ii++;
			if (ii === raw.length) return;
		}

		throw new DesmostError.UnexpectedInput({
			msg: `Expected: \`${raw}\`, but found: \`${this.preview(init)}\``,
			...error_data,
		});
	}

	/**
	 * Attempt to consume `raw`, backtracking if `raw` was not found.
	 */
	protected try_consume(raw: string): void | NoMatch
	{
		let init = this.i;
		let ii = 0;

		while (this.current === raw[ii]) {
			let r = this.try_advance();
			if (r === NO_MATCH) break;

			ii++;
			if (ii === raw.length) return;
			if (this.i === this.length) break;
		}

		this.i = init;
		return NO_MATCH;
	}

	/**
	 * Consume 0 or more space characters.
	 */
	protected consume_spaces(): void
	{
		/* NOTE: Callers should be able to assume this is safe to call even when at end of input, since it should just match 0 characters */
		if (this.out_of_bounds()) return;

		while (this.current === " ") {
			this.advance();
		}
	}

	/**
	 * Consume 0 or more whitespace characters.
	 * 
	 * Same as `.consume_spaces()`, but allows tabs and newlines.
	 */
	protected consume_whitespace(): void
	{
		/* NOTE: Callers should be able to assume this is safe to call even when at end of input, since it should just match 0 characters */
		if (this.i >= this.length) return;

		while (
			this.current === " "
			|| this.current === "\n"
			|| this.current === "\t"
		) {
			this.advance();
		}
	}

	protected consume_end_of_block(error_data?: DesmostError.Data): Fallible<void>
	{
		if (this.i >= this.length) return;

		this.consume_spaces();

		this.consume("\n", {
			msg: `Expected a newline at the end of a block, but found: \`${this.preview()}\``,
			...error_data
		});
	}
}
