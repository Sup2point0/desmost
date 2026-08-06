import { DesmostParser, ParseResultKind } from "./parser";


/**
 * Parse the content in the given `source` Markdown code block, and inject the results into `desmos`.
 */
export function inject(
  /** The Desmos calculator instance to modify. */
  desmos: Desmos.Calculator,

  /** The Markdown code block containing the source LaTeX and special control commands. */
  source: string,
): void
{
  let parser = new DesmostParser(source);

  while (true) {
    let result = parser.parse_next();

    if (result == null) {
      // TODO
      continue;
    }
    
    if (result.kind === ParseResultKind.EXPRESSION) {
      // TODO
    }
  }
}
