import { type DesmostOptions, set_default_options } from "./options";
import { DesmostParser, Ast } from "../parser";
import { evaluate_global_incantation, evaluate_expr, evaluate_global_incantation_error } from "./evaluate";


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
  options = set_default_options(options);

  let parser = new DesmostParser(source);
  
  let deferred_exprs: Desmos.ExpressionState[] = [];

  while (true) {
    let r = parser.parse_next();
    if (r === null) break;

    let deferred: Ast.Expression | void;
    
    switch (r.kind) {
      case Ast.Kind.INCANTATION_INVOCATION:
        deferred = evaluate_global_incantation(r, desmos, options);
        break;

      case Ast.Kind.INVALID_INCANTATION:
        deferred = evaluate_global_incantation_error(r, desmos, options);
        break;

      case Ast.Kind.EXPRESSION:
        deferred = evaluate_expr(r, desmos, options);
        break;
    }

    if (deferred !== undefined) {
      deferred_exprs.push(deferred.data);
    }
  }

  desmos.setExpressions(deferred_exprs);
}
