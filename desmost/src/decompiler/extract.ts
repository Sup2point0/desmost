import { stringify_json5 } from "./format";

import { Ast } from "../parser";

import { DesmosIncantation, ViewportIncantation } from "../magic/global";


/**
 * Extract a `/desmos` incantation from the settings of `desmos`.
 */
export function extract_settings(
   desmos: Desmos.Calculator,
   blank: Desmos.Calculator,
): Ast.IncantationInvocation
{
   let defaults = blank.settings;

   let arg_raw = stringify_json5(
      desmos.settings,
      (k, v) => (
            v === defaults[k]
         || k === "__observers"
         || k === "guid"
         || k === "randomSeed"
         || k === "colors"
      ) ? undefined : v,
      "  ",
   );

	return {
		kind: Ast.Kind.INCANTATION_INVOCATION,
		incantation: new DesmosIncantation(),
		arg_raw,
	};
}

/**
 * Extract a `/viewport` incantation from the viewport bounds of `desmos`.
 */
export function extract_viewport(
   desmos: Desmos.Calculator,
   blank: Desmos.Calculator,
): Ast.IncantationInvocation
{
   let defaults = blank.graphpaperBounds.mathCoordinates;
	let { left, right, bottom, top } = desmos.graphpaperBounds.mathCoordinates;

	return {
		kind: Ast.Kind.INCANTATION_INVOCATION,
		incantation: new ViewportIncantation(),
		arg_raw: stringify_json5(
			{ left, right, bottom, top },
			(k, v) => v === defaults[k] ? undefined : v,
			"  ",
		),
	};
}

/**
 * Extract an expression and the local incantations that reproduce its state.
 */
export function extract_expression(expression: Desmos.ExpressionState): Ast.Expression
{
   let data;

   // @ts-expect-error: outdated types
   if (expression.latex?.trim() === "") {
      data = { latex: ` ` };
   } else {
      data = Object.fromEntries(
         Object.entries(expression)
         .filter(([key, value]) => !is_insignificant(key, value))
      );
   }

	return {
		kind: Ast.Kind.EXPRESSION,
		data,
		incantations: [],  // TODO
	};
}


function is_insignificant(key: string, value: any): boolean
{
   return (
         value === ""
      || typeof value === "object" && Object.values(value).every(v => v === "")
   );
}
