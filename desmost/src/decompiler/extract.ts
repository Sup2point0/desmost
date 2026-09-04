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
	return {
		kind: Ast.Kind.EXPRESSION,
		data: (
         expr.latex?.trim() === "" ? { latex: ` ` }
         : {
            type:  expr.type,
            latex: expr.latex,
            text:  expr.text,
         } as Desmos.ExpressionState
      ),
		incantations: extract_locals(expr),
	};
}

function extract_locals(expr: Desmos.ExpressionState): Ast.IncantationInvocation<LOCAL>[]
{
   /* NOTE: Currently only LaTeX expressions can have local incantations applied to them, this will change in future */
   switch (expr.type)
   {
      case "text":  return [];
      case "table": return [];
      default:      return (expr.latex?.trim() === "") ? [] : extract_locals_expr(expr);
   }
}

function extract_locals_expr(expr: Desmos.Expression): Ast.IncantationInvocation<LOCAL>[]
{
   return (
      [
         extract_colour(expr),
         extract_slider(expr),
      ]
      .filter(each => each != undefined)
      .map(inv => (
         { ...inv, kind: Ast.Kind.INCANTATION_INVOCATION } as Ast.IncantationInvocation<LOCAL>
      ))
   );
}

const extract_colour = (expr: Desmos.Expression) => ({
   incantation: LOCAL_INCANTATIONS.colour,
   arg_raw: expr.color,  // FIXME use name
});
const extract_slider = (expr: Desmos.Expression) => expr.sliderBounds && {
   incantation: LOCAL_INCANTATIONS.slider,
   arg_raw: JSON.stringify(defined_entries(expr.sliderBounds)),
};


function defined_entries(obj: object): unknown
{
   return Object.fromEntries(
      Object.entries(obj)
      .filter((key, value) => value != undefined)
   );
}
