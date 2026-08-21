import { stringify_json5 } from "./format";

import { Ast } from "../parser";

import { DesmosIncantation, ViewportIncantation } from "../magic/global";


/**
 * Extract a `/desmos` incantation from the settings of `desmos`.
 */
export function extract_settings(desmos: Desmos.Calculator): Ast.IncantationInvocation
{
	return {
		kind: Ast.Kind.INCANTATION_INVOCATION,
		incantation: new DesmosIncantation(),
		arg_raw:
         stringify_json5(
            desmos.settings,
            (key, value) => ["observe", "unobserve"].includes(key) ? undefined : value,
            "  ",
         )
	};
}

/**
 * Extract a `/viewport` incantation from the viewport bounds of `desmos`.
 */
export function extract_viewport(desmos: Desmos.Calculator): Ast.IncantationInvocation
{
	let { left, right, bottom, top } = desmos.graphpaperBounds.mathCoordinates;

	return {
		kind: Ast.Kind.INCANTATION_INVOCATION,
		incantation: new ViewportIncantation(),
		arg_raw: stringify_json5(
			{ left, right, bottom, top },
			undefined,
			"  ",
		),
	};
}

/**
 * Extract an expression and the local incantations that reproduce its state.
 */
export function extract_expression(expression: Desmos.ExpressionState): Ast.Expression
{
	return {
		kind: Ast.Kind.EXPRESSION,
		data: expression,
		incantations: [],  // TODO
	};
}
