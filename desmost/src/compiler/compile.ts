import { type DesmostOptions, set_default_options } from "./options";
import { evaluate_global_incantation, evaluate_expr, evaluate_error } from "./evaluate";

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
): void | DesmostDebug
{
  if (desmos == undefined) {
    console.error(`Desmost: No \`Desmos.Calculator\` instance provided, aborting compilation!`);
    return;
  }

  if (source == undefined) {
    console.error(`Desmost: No source code provided, aborting compilation!`);
    return;
  }

  let t_init = performance.now();
  let ast = [];

  let opts = set_default_options(options);
  let parser = new DesmostParser(source, opts);
  
  /* To aggregate errors at the start, we need a target to retroactively inject errors into */
  if (opts.place_errors === "start") {
    desmos.setExpression({ id: "deferred-start", latex: "" });
  }

  let errors = [];

  try {
    while (true) {
      let r = parser.parse_next();
      if (r === null) break;

      if (opts.debug) {
        ast.push(r);
      }

      let defer: string | void = undefined;
      
      switch (r.kind) {
        case Ast.Kind.INCANTATION_INVOCATION:
          defer = evaluate_global_incantation(r, desmos, opts);
          break;

        case Ast.Kind.EXPRESSION:
          // @ts-expect-error: outdated types
          if (opts.ignore_blank_lines && r.data.latex === " ") break;
          defer = evaluate_expr(r, desmos, opts);
          break;

        case Ast.Kind.INVALID_INCANTATION:
          defer = evaluate_error(r.error, desmos, opts);
          break;
      }

      if (defer !== undefined) {
        errors.push(defer);
      }
    }
  }
  catch (e) {
    if (e instanceof UnrecoverableError) {
      errors.push(e);
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

  if (opts.debug) {
    return {
      duration: performance.now() - t_init,
      ast,
    };
  }
}


interface DesmostDebug
{
  duration: number;
  ast: Ast[];
}
