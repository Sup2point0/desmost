import { Incantation } from "./incantations";


export enum ParseResultType
{
  ExpressionState,
}


namespace ParseResult
{
  export interface ExpressionState
  {
    kind: ParseResultType.ExpressionState,
  }
}


export type ParseResult = ParseResult.ExpressionState;


export class Parser
{
  private source: string;
  private i: number = 0;

  constructor(source: string)
  {
    this.source = source;
  }

  parse_next(): ParseResult | null
  {
    if (this.source[this.i] === "/") {
      this.try_parse_control();
    } else {
      return this.parse_line();
    }

      // check if /
        // if so, read until we find ::
        // if no :: found, bail and set line as LaTeX
          // if found:
            // slice
            // parse
            // keep reading until end of line
  }

  private parse_line(): ParseResult.ExpressionState
  {
    let init = this.i;

    while (this.source[this.i] !== "\n"); {
      this.i++;
    }

    this.i++;

    let line = this.source.slice(init, this.i);

    return {
      latex: line,
    };
  }

  private parse_control(): Incantation | null
  {
    // TODO
  }
}
