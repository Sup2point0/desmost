import { Incantation } from "./incantations";


export enum ParseResultKind
{
  DONE,
  EXPRESSION,
}


namespace ParseResult
{
  export interface Done
  {
    kind: ParseResultKind.DONE;
  }

  export interface Expression
  {
    kind: ParseResultKind.EXPRESSION;
    data: Desmos.ExpressionState;
  }
}


export type ParseResult =
  | ParseResult.Done
  | ParseResult.Expression
;


export class Parser
{
  private source: string;
  private i:      number = 0;
  private length: number;

  constructor(source: string)
  {
    this.source = source;
    this.length = source.length;
  }

  parse_next(): ParseResult | null
  {
    if (this.i >= this.length) {
      return { kind: ParseResultKind.DONE };
    }

    if (this.source[this.i] === "/") {
      // this.try_parse_control();
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

    return null;
  }

  private parse_line(): ParseResult.Expression
  {
    let init = this.i;

    while (this.source[this.i] !== "\n" && this.i < this.length); {
      this.i++;
    }

    this.i++;

    let line = this.source.slice(init, this.i);

    return {
      kind: ParseResultKind.EXPRESSION,
      data: {
        latex: line,
      },
    };
  }

  private parse_control(): Incantation | null
  {
    // TODO
  }
}
