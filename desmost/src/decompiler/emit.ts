import type { Ast } from "../parser";


/**
 * Emit the source code for a global incantation `invocation`.
 */
export function emit_global_incantation(invocation?: Ast.IncantationInvocation): string
{
	if (invocation == undefined) return "";

   let ident = invocation.incantation.identifier;
   let arg_raw = invocation.arg_raw;
	
   return `/${ident}{ ${arg_raw} }`;
}


/**
 * Emit the source code for an `expr`.
 */
export function emit_expression(expr?: Ast.Expression): string
{
	if (expr == undefined) return "";

	// TODO
   let locals = [];

   let sep = expr.incantations.length > 0 ? " :: " : "";
   
   let content;

   switch (expr.data.type) {
      case "text":
         content = expr.data.text;
         break;
      default:
         // @ts-expect-error: outdated types
         content = expr.data.latex ?? "?";
   }

   return `${locals.join(" ")}${sep}${content}`;
}
