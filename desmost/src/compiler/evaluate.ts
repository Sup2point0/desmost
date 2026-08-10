import type { DesmostOptions } from "./options";
import { Ast } from "./parser";


/**
 * Evaluate arguments (if any) to a global incantation `invocation`, then apply the incantation to `desmos`.
 */
export function evaluate_global_incantation(
  invocation: Ast.IncantationInvocation | Ast.ArgIncantationInvocation,
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
  error: Ast.InvalidIncantation,
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
  expr: Ast.Expression,
  desmos: Desmos.Calculator,
  options: DesmostOptions,
): void
{
  for (let invocation of expr.incantations) {
    if (invocation.kind === Ast.Kind.INVALID_INCANTATION) {
      evaluate_expr_error(invocation, desmos, options);
      continue;
    }

    let data = undefined;

    if ("arg_raw" in invocation) {
      data = invocation.incantation.evaluate_arg(invocation.arg_raw);
    }

    invocation.incantation.apply(expr.data, data);
  }
  
  desmos.setExpression(expr.data);
}


function evaluate_expr_error(
  error: Ast.InvalidIncantation,
  desmos: Desmos.Calculator,
  options: DesmostOptions,
)
{
  switch (options.errors) {}
}
