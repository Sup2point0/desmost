import dedent from "dedent";

import { format_error, normalise_latex, prettify_latex } from "./format";

import type { DesmostOptions } from "../options";
import { DesmostError, type Unrecoverable } from "../errors";
import { DesmostParser, Ast } from "../parser";
import { is_latex } from "../utils";


/** Debug diagnostics returned from `compile()`. */
export interface DesmostDebug
{
	duration: number;
	num_blocks: number;
	ast: Ast[];
}


export class DesmostCompiler
{
	private desmos: Desmos.Calculator

	/** The source code to compile. */
	private source: string

	private options: DesmostOptions

	private parser: DesmostParser

	/** Accumulated errors awaiting evaluation. */
	private errors: DesmostError[] = []

	/**
	 * Have we only seen blank lines so far?
	 * 
	 * This is used for excluding leading blanks.
	 */
	private seen_non_blank = false

	/**
	 * The number of pending blank expressions to add.
	 * 
	 * This is used to excluding trailing blanks.
	 */
	private pending_blanks: number = 0

	private debug: DesmostDebug | null = null


	/** Create a compiler for compiling `source` into `desmos`. */
	constructor(
		desmos: Desmos.Calculator,
		source: string,
		options: DesmostOptions,
	)
	{
		this.desmos = desmos;
		this.source = source;
		this.options = options;
		this.parser = new DesmostParser(this.source, this.options);
	}


	/**
	 * Run the compiler to completion.
	 */
	public compile(): Unrecoverable<void | DesmostDebug>
	{
		if (this.options.debug) {
			this.debug = {
				duration: performance.now(),
				num_blocks: 0,
				ast: [],
			};
		}

		/* To aggregate errors at the start, we need a target to retroactively inject errors into */
		if (this.options.place_errors === "start") {
			this.desmos.setExpression({ id: "deferred", latex: " " });  // FIXME check if ` ` needed
		}

		/* The compiler is lazy, parsing and evaluating one block at a time (as opposed to first parsing the entire AST). We don't need the whole AST, so this saves memory. */
		/* NOTE: It also doesn't sacrifice performance, since `.setExpressions()` internally just calls `.setExpression()` in a loop anyway. Benchmarks in the frontend produce similar times for both, so there's no performance improvement. */
		try {
			let done = false;

			while (!done) {
				done = this.compile_next();
			}
		}
		catch (e) {
			this.errors.push(e as Error);  // FIXME Should probably override as critical
		}

		if (this.options.keep_trailing_blanks) {
			this.flush_pending_blanks();
		}

		/* NOTE: No need to check `options.place_errors`!

			- If it's `start`, `id: deferred` will replace the placeholder at the start as required.
			- If it's `end`, `id: deferred` won't exist so this expression will be appended as required.
			- If it's `inline`, we shouldn't have any accumulated errors at all, but if we do, then the end is where they should be anyway.
		*/
		if (this.errors.length > 0) {
			this.desmos.setExpression({ id: "deferred", type: "text", text: this.errors.join("\n\n") });
		} else {
			this.desmos.removeExpression({ id: "deferred" });
		}

		if (this.options.debug) {
			this.debug!.duration = performance.now() - this.debug!.duration;

			return this.debug!;
		}
	}

	/**
	 * Compile only the next block, returning `true` if compilation has finished.
	 */
	compile_next(): Unrecoverable<boolean>
	{
		let result = this.parser.parse_next();
		if (result === undefined) return true;

		let { blocks, errors } = result;

		let block = blocks[0];  // TODO future foreach

		if (this.options.debug && block !== null) {
			this.debug!.num_blocks++;
			this.debug!.ast.push(block);
		}
		
		if (block !== null) switch (block.kind)
		{
			case Ast.Kind.INCANTATION_INVOCATION:
				this.evaluate_global_incantation(block);
				break;

			case Ast.Kind.EXPRESSION:
				// @ts-expect-error: check type-narrows
				if (block.data.latex === " ") {
					if (this.options.ignore_all_blanks) break;
					if (!this.seen_non_blank && !this.options.keep_leading_blanks) break;
					this.pending_blanks++;
					break;
				}
				else {
					this.flush_pending_blanks();
					this.pending_blanks = 0;
					
					this.seen_non_blank = true;
					this.evaluate_expr(block);
					break;
				}
		}

		for (let error of errors) {
			this.evaluate_error(error);
		}

		return false;
	}


	// == LOW-LEVEL == //

	/**
	 * Evaluate arguments (if any) to a global incantation `invocation`, then apply the incantation to `desmos`.
	 */
	evaluate_global_incantation(invocation: Ast.IncantationInvocation): Unrecoverable<void>
	{
		let data = undefined;

		if ("arg_raw" in invocation && invocation.arg_raw != undefined) {
			try {
				data = invocation.incantation.evaluate_arg(invocation.arg_raw, this.options);
			}
			catch (e) {
				this.evaluate_error(e as Error);
			}
		}

		invocation.incantation.apply(this.desmos, data);
	}


	/**
	 * Evaluate local incantation invocations on `expr`, then add `expr` to `desmos`.
	 */
	evaluate_expr(expr: Ast.Expression): Unrecoverable<void>
	{
		for (let invocation of expr.incantations) {
			let data = undefined;

			if ("arg_raw" in invocation && invocation.arg_raw != undefined) {
				try {
					data = invocation.incantation.evaluate_arg(invocation.arg_raw, this.options);
				}
				catch (e) {
					this.evaluate_error(e as Error);
					// if it needs the arg, then we can't press on
					if (invocation.incantation.requires_arg) continue;
				}
			}

			try {
				invocation.incantation.apply(expr.data, data);
			}
			catch (e) {
				this.evaluate_error(e as Error);
			}
		}

		if (is_latex(expr.data)) {
			expr.data.latex = normalise_latex(expr.data.latex!);

			if (this.options.prettify) {
				expr.data.latex = prettify_latex(expr.data.latex);
			}
		}
		else if (expr.data.type === "text" && this.options.dedent_text) {
			expr.data.text = dedent(expr.data.text ?? "");
		}

		this.desmos.setExpression(expr.data);
	}

	/**
	 * Handle a `DesmostError`, respecting the user's options.
	 */
	evaluate_error(error: DesmostError): Unrecoverable<void | string>
	{
		switch (this.options.errors) {
			case "crash":
				throw error;

			case "suppress":
				console.error(format_error(error, this.options));
				break;

			default: switch (this.options.place_errors) {
				case "end":
				case "start":
					this.errors.push(error);
					break;
				
				case "inline":
					this.desmos.setExpression({
						type: "text",
						text: format_error(error, this.options),
					});
					break;
			}
		}
	}

	flush_pending_blanks()
	{
		for (let i = 0; i < this.pending_blanks; i++) {
			this.desmos.setExpression({ latex: ` ` });
		}
	}
}
