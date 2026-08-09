import { DesmostOptions, set_default_options } from "./options";
import { DesmostParser, ParseResult } from "./parser";
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

  while (true) {
    let r = parser.parse_next();

    if (r === ParseResult.DONE) {
      break;
    }
    
    switch (r.kind) {
      case ParseResult.Kind.INCANTATION_INVOCATION:
        evaluate_global_incantation(r, desmos, options);
        break;

      case ParseResult.Kind.INVALID_INCANTATION:
        evaluate_global_incantation_error(r, desmos, options);
        break;

      case ParseResult.Kind.EXPRESSION:
        evaluate_expr(r, desmos, options);
        break;
    }
  }
}
