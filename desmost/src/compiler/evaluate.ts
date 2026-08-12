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
      let e = evaluate_error(invocation, desmos, { ...options, place_errors: "start" });
      if (e != undefined) {
        errors.push(e);
      }
      continue;
    }

    let data = undefined;

    if ("arg_raw" in invocation && invocation.arg_raw != undefined) {
      try {
        data = invocation.incantation.evaluate_arg(invocation.arg_raw);
      }
      catch (e) {
        errors.push(format_error(e as any, options));
        if (invocation.incantation.requires_arg) continue;
      }
    }

    invocation.incantation.apply(expr.data, data);
  }
  
  if (errors.length > 0) {
    desmos.setExpression({ type: "text", text: errors.join("\n\n") });
  }
  desmos.setExpression(expr.data);
}


/**
 * Handle an `InvalidInvocation`, respecting the user's preferences in `options`.
 * 
 * If the user set `place_errors: start` or `place_errors: end`, this returns the formatted error message for deferred aggregation.
 */
export function evaluate_error(
  invocation: Ast.InvalidInvocation,
  desmos: Desmos.Calculator,
  options: Required<DesmostOptions>,
): Unrecoverable<void | string>
{
  switch (options.errors) {
    case "crash":
      throw invocation.error;

    case "suppress":
      console.error(invocation.error);
      break;

    default: switch (options.place_errors) {
      case "end":
      case "start":
        return format_error(invocation.error, options);
      
      default:
        desmos.setExpression({
          type: "text",
          text: format_error(invocation.error, options),
        });
        break;
    }
  }
}


function format_error(
  e: UnrecoverableError,
  options: Required<DesmostOptions>,
): string
{
  let prefix = options.error_prefix;
  let sep = (prefix === "" || prefix.endsWith("\n")) ? "" : " ";

  return `${prefix}${sep}${e.name}: ${e.message}`;
  // TODO maybe include stack? (configurable?)
}
