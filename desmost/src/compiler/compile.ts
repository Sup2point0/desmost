import { type DesmostOptions, fill_defaults } from "./options";
import { evaluate_global_incantation, evaluate_expr, evaluate_error } from "./evaluate";

import { DesmostParser, Ast } from "../parser";


/** Debug diagnostics returned from `compile()`. */
export interface DesmostDebug
{
	duration: number;
	num_blocks: number;
	ast: Ast[];
}


/**
 * Compile Desmost into Desmos.
 * 
 * This calls the Desmost compiler: parsing and evaluating `source`, then injecting the results into an existing `desmos` instance. Pass in `options` to customise compilation.
 * 
 * ## Example
 * 
 * ```ts
 * let calc = Desmos.GraphingCalculator();
 * 
 * compile(calc, `/text{ sup world! }`);
 * 
 * compile(calc, `/slider{ error! } :: t = 0`, {
 *   errors: "crash",
 * });
 * ```
 */
export function compile(
	/** The Desmos calculator instance to compile into. */
	desmos: Desmos.Calculator,

	/** The Desmost source code to compile. */
	source: string,

	/** Compilation options. */
	options?: DesmostOptions,
): void | DesmostDebug
{
	if (desmos == undefined) {
		console.error(`Desmost: No \`Desmos.Calculator\` instance provided, aborting compilation!`);
		return;
	}

	if (source == undefined) {
		console.error(`Desmost: No source code provided, aborting compilation!`);
		return;
	}

	let opts = fill_defaults(options);

	if (opts.debug) {
		var t_init = performance.now();
		var num_blocks = 0;
		var ast: Ast[] = [];
	}

	let parser = new DesmostParser(source, opts);

	let errors: string[] = [];
	
	/* To aggregate errors at the start, we need a target to retroactively inject errors into */
	if (opts.place_errors === "start") {
		desmos.setExpression({ id: "deferred-start", latex: " " });  // FIXME check if ` ` needed
	}

	/* Keep track of whether we're still evaluating leading blank expressions, which might be ignored. */
	let seen_non_blank = false;

	/** The number of pending blank expressions to add. */
	let pending_blanks: number = 0;

	/* The compiler is lazy, parsing and evaluating one block at a time (as opposed to first parsing the entire AST). We don't need the whole AST, so this saves memory. */
	/* NOTE: It also doesn't sacrifice performance, since `.setExpressions()` internally just calls `.setExpression()` in a loop anyway. Benchmarks in the frontend produce similar times for both, so there's no performance improvement. */
	try {
		while (true) {
			let r = parser.parse_next();
			if (r === null) break;

			if (opts.debug) {
				num_blocks!++;
				ast!.push(r);
			}

			/** An error message to leave for aggregation later. */
			let defer: string | void = undefined;
			
			switch (r.kind) {
				case Ast.Kind.INCANTATION_INVOCATION:
					defer = evaluate_global_incantation(r, desmos, opts);
					break;

				case Ast.Kind.EXPRESSION:
					// @ts-expect-error: outdated types
					if (r.data.latex === " ") {
						if (opts.ignore_all_blanks) break;
						if (!seen_non_blank && !opts.keep_leading_blanks) break;
						pending_blanks++;
						break;
					}
					else {
						flush_pending_blanks(desmos, pending_blanks);
						pending_blanks = 0;
						
						seen_non_blank = true;
						defer = evaluate_expr(r, desmos, opts);
						break;
					}

				case Ast.Kind.INVALID_INCANTATION:
					defer = evaluate_error(r.error, desmos, opts);
					break;
			}

			if (defer !== undefined) {
				errors.push(defer);
			}
		}
	}
	catch (e) {
		errors.push((e as Error).message);
	}

	if (opts.keep_trailing_blanks) {
		flush_pending_blanks(desmos, pending_blanks);
	}

	if (errors.length > 0) {
		let expr: Desmos.ExpressionState = {
			type: "text",
			text: errors.join("\n\n"),
		};

		switch (opts.place_errors) {
			case "start":
				desmos.setExpression({ ...expr, id: "deferred-start" });
				break;
			case "end":
			case "inline":
				desmos.setExpression(expr);
				break;
		}
	}

	if (opts.debug) {
		return {
			duration: performance.now() - t_init!,
			num_blocks: num_blocks!,
			ast: ast!,
		};
	}
}


function flush_pending_blanks(desmos: Desmos.Calculator, count: number)
{
	for (let i = 0; i < count; i++) {
		desmos.setExpression({ latex: ` ` });
	}
}
