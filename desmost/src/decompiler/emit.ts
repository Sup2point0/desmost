import type { Ast } from "../parser";


/**
 * Emit the source code for a global incantation `invocation`.
 */
export function emit_global_incantation(invocation?: Ast.IncantationInvocation): string
{
  if (invocation == undefined) return "";
  // TODO
}


/**
 * Emit the source code for an `expr`.
 */
export function emit_expression(expr?: Ast.Expression): string
{
  if (expr == undefined) return "";
  // TODO
}
