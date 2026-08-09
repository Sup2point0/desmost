import { DesmostOptions, set_default_options } from "./options";
import { DesmostParser, ParseResult } from "./parser";
import { evaluate_global_incantation, evaluate_expr, evaluate_global_incantation_error } from "./evaluate";


/**
 * Compile Desmost into Desmos.
 * 
 * This calls the Desmost compiler: parsing `source`, and injecting the results into an existing `desmos` instance.
 */
export function compile(
  /** The Desmos calculator instance to modify. */
  desmos: Desmos.Calculator,

  /** The Desmost source code. */
  source: string,

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
