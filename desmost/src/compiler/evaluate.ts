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
    try {
      data = invocation.incantation.evaluate_arg(invocation.arg_raw);
    }
    catch (e) {
      let msg = evaluate_error(e as Error, desmos, options);
      if (msg != undefined) {
        return msg;
      }
    }
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
  let errors: string[] = [];

  for (let invocation of expr.incantations) {
    if (invocation.kind === Ast.Kind.INVALID_INCANTATION) {
      let msg = evaluate_error(invocation.error, desmos, { ...options, place_errors: "start" });
      if (msg != undefined) {
        errors.push(msg);
      }
      continue;
    }

    let data = undefined;

    if ("arg_raw" in invocation && invocation.arg_raw != undefined) {
      try {
        data = invocation.incantation.evaluate_arg(invocation.arg_raw);
      }
      catch (e) {
        errors.push(format_error(e as Error, options));
        if (invocation.incantation.requires_arg) continue;
      }
    }

    invocation.incantation.apply(expr.data, data);
  }
  
  if (errors.length > 0) {
    desmos.setExpression({ type: "text", text: errors.join("\n\n") });
  }

  // @ts-expect-error: outdated types
  if (expr.data.latex != undefined) {
    // @ts-expect-error: outdated types
    expr.data.latex = normalise_latex(expr.data.latex);

    if (options.prettify) {
      // @ts-expect-error: outdated types
      expr.data.latex = prettify_latex(expr.data.latex);
    }
  }

  desmos.setExpression(expr.data);
}


/**
 * Handle an `InvalidInvocation`, respecting the user's preferences in `options`.
 * 
 * If the user set `place_errors: start` or `place_errors: end`, this returns the formatted error message for deferred aggregation.
 */
export function evaluate_error(
  error: UnrecoverableError,
  desmos: Desmos.Calculator,
  options: Required<DesmostOptions>,
): Unrecoverable<void | string>
{
  switch (options.errors) {
    case "crash":
      throw error;

    case "suppress":
      console.error(error);
      break;

    default: switch (options.place_errors) {
      case "end":
      case "start":
        return format_error(error, options);
      
      default:
        desmos.setExpression({
          type: "text",
          text: format_error(error, options),
        });
        break;
    }
  }
}


/**
 * Remove line breaks from `latex` so Desmos can properly consume it.
 */
function normalise_latex(latex: string): string
{
  return latex.replaceAll("\n", " ");
}


/**
 * Prettify `latex` to render nicely in Desmos, reflecting how you would type directly into Desmos.
 * 
 * This includes:
 * 
 * - Replace `()`, `[]`, etc. with `\left(\right)`
 * - Replace `min()`, `max()`, etc. with `\operatorname{min}()`
 */
function prettify_latex(latex: string): string
{
  latex = latex.replaceAll("(", "\\left(");
  latex = latex.replaceAll(")", "\\right)");
  latex = latex.replaceAll("[", "\\left[");
  latex = latex.replaceAll("]", "\\right]");
  latex = latex.replaceAll("\\{", "\\left{");
  latex = latex.replaceAll("\\}", "\\right}");
  latex = latex.replaceAll(/(?<=[^\w]|^)(min)(?=\(|\\left\()/g, "\\1");
  return latex;
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
