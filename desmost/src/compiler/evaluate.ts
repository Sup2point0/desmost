import dedent from "dedent";

import { format_error, normalise_latex, prettify_latex } from "./format";
import type { DesmostOptions } from "./options";

import { Ast } from "../parser";
import { UnrecoverableError, type Unrecoverable } from "../errors";
import { is_latex } from "../desmos";


/**
 * Evaluate arguments (if any) to a global incantation `invocation`, then apply the incantation to `desmos`.
 */
export function evaluate_global_incantation(
	invocation: Ast.IncantationInvocation,
	desmos: Desmos.Calculator,
	options: DesmostOptions,
): Unrecoverable<void | string>
{
	let data = undefined;

	if ("arg_raw" in invocation && invocation.arg_raw != undefined) {
		try {
			data = invocation.incantation.evaluate_arg(invocation.arg_raw, options);
		}
		catch (e) {
			let msg = evaluate_error(e as Error, desmos, options);
			return msg;
		}
	}

	invocation.incantation.apply(desmos, data);
}


/**
 * Evaluate local incantation invocations on `expr`, then add `expr` to `desmos`.
 */
export function evaluate_expr(
	expr: Ast.Expression,
	desmos: Desmos.Calculator,
	options: DesmostOptions,
): Unrecoverable<void | string>
{
	let errors: string[] = [];

	for (let invocation of expr.incantations) {
		if (invocation.kind === Ast.Kind.INVALID_INCANTATION) {
			let msg = evaluate_error(invocation.error, desmos, { ...options, place_errors: "start" });
			if (msg != undefined) {
				errors.push(msg);
			}
			continue;
		}

		let data = undefined;

		if ("arg_raw" in invocation && invocation.arg_raw != undefined) {
			try {
				data = invocation.incantation.evaluate_arg(invocation.arg_raw, options);
			}
			catch (e) {
				errors.push(format_error(e as Error, options));
				// if it needs the arg, then we can't press on
				if (invocation.incantation.requires_arg) continue;
			}
		}

		try {
			invocation.incantation.apply(expr.data, data);
		}
		catch (e) {
			errors.push(format_error(e as Error, options));
		}
	}
	
	if (errors.length > 0) {
		desmos.setExpression({ type: "text", text: errors.join("\n\n") });
	}

	if (is_latex(expr.data)) {
		expr.data.latex = normalise_latex(expr.data.latex!);

		if (options.prettify) {
			expr.data.latex = prettify_latex(expr.data.latex);
		}
	}
	else if (expr.data.type === "text" && options.dedent_text) {
		expr.data.text = dedent(expr.data.text ?? "");
	}

	desmos.setExpression(expr.data);
}


/**
 * Handle an `InvalidInvocation`, respecting the user's preferences in `options`.
 * 
 * If the user set `place_errors: start` or `place_errors: end`, this returns the formatted error message for deferred aggregation.
 */
export function evaluate_error(
	error: UnrecoverableError,
	desmos: Desmos.Calculator,
	options: DesmostOptions,
): Unrecoverable<void | string>
{
	switch (options.errors) {
		case "crash":
			throw error;

		case "suppress":
			console.error(error);
			break;

		default: switch (options.place_errors) {
			case "end":
			case "start":
				return format_error(error, options);
			
			default:
				desmos.setExpression({
					type: "text",
					text: format_error(error, options),
				});
				break;
		}
	}
}
