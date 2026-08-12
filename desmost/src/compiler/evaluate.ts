import type { DesmostOptions } from "./options";

import { Ast } from "../parser";
import { UnrecoverableError, type Unrecoverable } from "../errors";


/**
 * Evaluate arguments (if any) to a global incantation `invocation`, then apply the incantation to `desmos`.
 */
export function evaluate_global_incantation(
  invocation: Ast.IncantationInvocation,
  desmos: Desmos.Calculator,
  options: Required<DesmostOptions>,
): Unrecoverable<void | string>
{
  let data = undefined;

  if ("arg_raw" in invocation && invocation.arg_raw != undefined) {
    data = invocation.incantation.evaluate_arg(invocation.arg_raw);
  }

  invocation.incantation.apply(desmos, data);
}


export function evaluate_global_incantation_error(
  error: Ast.InvalidIncantation,
  desmos: Desmos.Calculator,
  options: Required<DesmostOptions>,
): Unrecoverable<void | string>
{
  let text = `Error: ${error.error.message}`

  switch (options.errors) {
    case "crash":
      throw error.error;

    case "suppress":
      console.error(error.error);
      break;

    default:
    switch (options.place_errors) {
      case "start":
      case "end":
        return format_error(error.error);
      
      default:
        desmos.setExpression({ type: "text", text: format_error(error.error) });
        break;
    }
  }
}


/**
 * Evaluate arguments (if any) to local incantation invocations on `expr`, then add `expr` to `desmos`.
 */
export function evaluate_expr(
  expr: Ast.Expression,
  desmos: Desmos.Calculator,
  options: Required<DesmostOptions>,
): Unrecoverable<void | string>
{
  let errors = [];

  for (let invocation of expr.incantations) {
    if (invocation.kind === Ast.Kind.INVALID_INCANTATION) {
      let e = evaluate_expr_error(invocation, desmos, { ...options, place_errors: "start" });
      if (e != undefined) {
        errors.push(e);
      }
      continue;
    }

    let data = undefined;

    if ("arg_raw" in invocation && invocation.arg_raw != undefined) {
      data = invocation.incantation.evaluate_arg(invocation.arg_raw);
    }

    invocation.incantation.apply(expr.data, data);
  }
  
  if (errors.length > 0) {
    desmos.setExpression({ type: "text", text: errors.join("\n\n") });
  }
  desmos.setExpression(expr.data);
}


function evaluate_expr_error(
  error: Ast.InvalidIncantation,
  desmos: Desmos.Calculator,
  options: Required<DesmostOptions>,
): Unrecoverable<void | string>
{
  switch (options.errors) {
    case "crash":
      throw error.error;

    case "suppress":
      console.error(error.error);
      break;

    default: switch (options.place_errors) {
      case "end":
      case "start":
        return format_error(error.error);
      
      default:
        desmos.setExpression({ type: "text", text: format_error(error.error) });
        break;
    }
  }
}


function format_error(e: UnrecoverableError | string): string
{
  let text = (e instanceof UnrecoverableError ? e.message : e);

  return `!! ${text}`;
}
