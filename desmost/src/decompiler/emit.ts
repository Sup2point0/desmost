import { DEFAULT_OPTIONS, type DesmostOptions } from "../options";
import { Incantation } from "../magic";
import type { Ast } from "../parser";
import { prettify_source } from "./format";


/**
 * Emit the source code for a global incantation `invocation`.
 */
export function emit_global_incantation(
   invocation: Ast.IncantationInvocation,
   options: DesmostOptions,
): string
{
	if (invocation == undefined) return "";

   let ident = invocation.incantation.identifier;

   if ("arg_raw" in invocation) {
      let arg_raw = invocation.arg_raw;

      if (invocation.incantation.arg_type === Incantation.ArgType.OBJECT) {
         return `/${ident}{\n  ${arg_raw}\n}`;
      } else {
         return `/${ident}{${arg_raw}}`;
      }
   } else {
      return `/${ident}`
   }
}


/**
 * Emit the source code for an `expr`.
 */
export function emit_expression(
   expr: Ast.Expression,
   options: DesmostOptions,
): string
{
	if (expr == undefined) return "";

	// TODO
   let locals: string[] = [];

   let sep = expr.incantations.length > 0 ? " :: " : "";
   
   let content;

   switch (expr.data.type) {
      case "text":
         expr.data.text ??= "";

         content = (
              expr.data.text.startsWith(DEFAULT_OPTIONS.error_prefix) ? `% [invalid]`
            : expr.data.text.includes("\n") ? `/text{\n${expr.data.text}\n}`
            :                                 `% ${expr.data.text}`
         );
         break;
      
      case "table":
         content = "% [tables are currently unsupported]";
         break;
      
      default:
         content = (
              expr.data.latex?.trim() === "" ? ""
            : expr.data.latex == undefined ? "% [unsupported]"
            : options.prettify             ? prettify_source(expr.data.latex)
            :                                expr.data.latex
         );
   }

   return `${locals.join(" ")}${sep}${content}`;
}
