import { DesmostOptions } from "./options";
import { ParseResult } from "./parser";


/**
 * Evaluate arguments (if any) to a global incantation `invocation`, then apply the incantation to `desmos`.
 */
export function evaluate_global_incantation(
  invocation: ParseResult.IncantationInvocation | ParseResult.ArgIncantationInvocation,
  desmos: Desmos.Calculator,
  options: DesmostOptions,
): void
{
  let data = undefined;

  if ("arg_raw" in invocation) {
    data = invocation.incantation.evaluate_arg(invocation.arg_raw);
  }

  invocation.incantation.apply(desmos, data);
}


export function evaluate_global_incantation_error(
  error: ParseResult.InvalidIncantation,
  desmos: Desmos.Calculator,
  options: DesmostOptions,
): void
{
  // TODO
}


/**
 * Evaluate arguments (if any) to local incantation invocations on `expr`, then add `expr` to `desmos`.
 */
export function evaluate_expr(
  expr: ParseResult.Expression,
  desmos: Desmos.Calculator,
  options: DesmostOptions,
): void
{
  for (let invocation of expr.incantations) {
    desmos.setExpression(expr.data);
  }
}
