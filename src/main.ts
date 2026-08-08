import { DesmostParser, ParseResult } from "./parser";


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

  options: DesmostOptions,
): void
{
  let parser = new DesmostParser(source);

  while (true) {
    let block = parser.parse_next();

    if (block === ParseResult.DONE) {
      break;
    }
    
    switch (block.kind) {
      // global incantation
      case ParseResult.Kind.INCANTATION_INVOCATION:
        let data = undefined;

        if ("arg_raw" in block) {
          data = block.incantation.evaluate_arg(block.arg_raw);
        }

        block.incantation.apply(desmos, data);
        break;

      // global incantation (error)
      case ParseResult.Kind.INVALID_INCANTATION:
        // TODO
        break;

      // expression
      case ParseResult.Kind.EXPRESSION:
        break;
    }
  }
}


/** Options to customise Desmost compilation. */
interface DesmostOptions
{
  /** How should errors be handled? */
  errors: "show" | "show-at-end" | "hide";
}
