import { Ast } from "../parser";
import { LOCAL_INCANTATIONS } from "../magic";
import type { LOCAL } from "../magic";


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
      default:
         if (expr.latex?.trim() === "") {
            return [];
         }
         else {
            return (
               Object.values(LOCAL_INCANTATIONS)
               .map(inc => inc.extract(expr))
               .filter(each => each != undefined)
            );
         }
   }
}
