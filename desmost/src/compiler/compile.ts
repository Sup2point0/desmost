import { type DesmostOptions, set_default_options } from "./options";
import { evaluate_global_incantation, evaluate_expr, evaluate_global_incantation_error } from "./evaluate";

import { DesmostParser, Ast } from "../parser";
import { UnrecoverableError } from "../errors";


/**
 * Compile Desmost into Desmos.
 * 
 * This calls the Desmost compiler: parsing and evaluating `source`, then injecting the results into an existing `desmos` instance. Pass in `options` to customise compilation.
 * 
 * ## Example
 * 
 * ```ts
 * let calc = Desmos.GraphingCalculator();
 * 
 * compile(calc, `/text{ sup world! }`);
 * 
 * compile(calc, `/slider{ error! } :: t = 0`, {
 *   errors: "crash",
 * });
 * ```
 */
export function compile(
  /** The Desmos calculator instance to compile into. */
  desmos: Desmos.Calculator,

  /** The Desmost source code to compile. */
  source: string,

  /** Compilation options. */
  options?: DesmostOptions,
): void
{
  let opts = set_default_options(options);
  let parser = new DesmostParser(source);
  
  /* If the user sets `options.place_errors: "start"`, we need a target to retroactively inject errors into. */
  desmos.setExpression({ id: "deferred-start", latex: "" });
  let errors = [];

  try {
    while (true) {
      let r = parser.parse_next();
      if (r === null) break;

      let defer: string | void;
      
      switch (r.kind) {
        case Ast.Kind.INCANTATION_INVOCATION:
          defer = evaluate_global_incantation(r, desmos, opts);
          break;

        case Ast.Kind.INVALID_INCANTATION:
          defer = evaluate_global_incantation_error(r, desmos, opts);
          break;

        case Ast.Kind.EXPRESSION:
          defer = evaluate_expr(r, desmos, opts);
          break;
      }

      if (defer !== undefined) {
        errors.push(defer);
      }
    }
  }
  catch (e) {
    if (e instanceof UnrecoverableError) {
      errors = [e.message];
    } else {
      throw e;
    }
  }

  if (errors.length > 0) {
    let expr: Desmos.ExpressionState = {
      type: "text",
      text: errors.join("\n\n"),
    };

    switch (opts.place_errors) {
      case "start":
        desmos.setExpression({ ...expr, id: "deferred-start" });
        break;
      case "end":
      case "inline":
        desmos.setExpression(expr);
        break;
    }
  }
}
