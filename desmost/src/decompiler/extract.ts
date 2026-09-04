import { stringify_json5 } from "./format";

import { Ast } from "../parser";
import { GLOBAL_INCANTATIONS, LOCAL_INCANTATIONS } from "../magic";
import type { LOCAL } from "../magic";


/**
 * Extract a `/desmos` incantation from the settings of `desmos`.
 */
export function extract_settings(
   desmos: Desmos.Calculator,
   blank: Desmos.Calculator,
): Ast.IncantationInvocation | null
{
   let defaults = blank.settings;

   let arg_raw = stringify_json5(
      desmos.settings,
      (k, v) => (
            // @ts-expect-error: weird
            v === defaults[k]
         || k === "__observers"
         || k === "guid"
         || k === "randomSeed"
         || k === "colors"
      ) ? undefined : v,
      "  ",
   );

   if (arg_raw.trim() === "") return null;

	return {
		kind: Ast.Kind.INCANTATION_INVOCATION,
		incantation: GLOBAL_INCANTATIONS.desmos,
		arg_raw,
	};
}

/**
 * Extract a `/viewport` incantation from the viewport bounds of `desmos`.
 */
export function extract_viewport(
   desmos: Desmos.Calculator,
   blank: Desmos.Calculator,
): Ast.IncantationInvocation | null
{
   let defaults = blank.graphpaperBounds.mathCoordinates;
	let { left, right, bottom, top } = desmos.graphpaperBounds.mathCoordinates;

   let arg_raw = stringify_json5(
      { left, right, bottom, top },
      /// @ts-expect-error: weird
      (k, v) => v === defaults[k] ? undefined : v,
      "  ",
   );

   if (arg_raw.trim() === "") return null;

	return {
		kind: Ast.Kind.INCANTATION_INVOCATION,
		incantation: GLOBAL_INCANTATIONS.viewport,
		arg_raw,
	};
}

/**
 * Extract an expression and the local incantations that reproduce its state.
 */
export function extract_expression(expr: Desmos.ExpressionState): Ast.Expression
{
   let data;

   // @ts-expect-error: check type-narrows
   if (expr.latex?.trim() === "") {
      data = { latex: ` ` };
   } else {
      data = Object.fromEntries(
         Object.entries(expr)
         .filter(([key, value]) => !is_insignificant(key, value))
      );
   }

	return {
		kind: Ast.Kind.EXPRESSION,
		data,
		incantations: extract_locals(expr),
	};
}

function is_insignificant(key: string, value: any): boolean
{
   return (
         value === ""
      || typeof value === "object" && Object.values(value).every(v => v === "")
   );
}

function extract_locals(expr: Desmos.ExpressionState): Ast.IncantationInvocation<LOCAL>[]
{
   /* NOTE: Currently only LaTeX expressions can have local incantations applied to them, this will change in future */
   switch (expr.type) {
      case "text": return [];
      case "table": return [];
      default: return extract_locals_expr(expr);
   }
}

function extract_locals_expr(expr: Desmos.Expression): Ast.IncantationInvocation<LOCAL>[]
{
   return [
      {
         incantation: LOCAL_INCANTATIONS.colour,
         arg_raw: expr.color,  // FIXME use name
      },
   ].map(
      inv => ({ ...inv, kind: Ast.Kind.INCANTATION_INVOCATION })
   );
}
