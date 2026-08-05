import { Incantation, ALL_INCANTATION_IDENTIFIERS } from "./incantations";


export namespace ParseResult
{
  export enum Kind
  {
    DONE,
    RECOVERABLE_FAIL,
    EXPRESSION,
  }

  /** The parser successfully reached the end of its source. */
  export interface Done { kind: Kind.DONE }

  /** Sentinel value to signal the parser successfully reached the end of its source. */
  export const DONE: Done = { kind: Kind.DONE };


  /** The parser encountered a recoverable failure. */
  export interface RecoverableFail { kind: Kind.RECOVERABLE_FAIL }

  /** Sentinel value for a recoverable failed parse attempt. */
  export const RECOVERABLE_FAIL: RecoverableFail = { kind: Kind.RECOVERABLE_FAIL };


  export interface Expression
  {
    kind: Kind.EXPRESSION;
    data: Desmos.ExpressionState;
  }
}

export type ParseResult =
  | ParseResult.Done
  | ParseResult.RecoverableFail
  | ParseResult.Expression
;


export class ParseError extends Error {}


/**
 * Stateful lazy parser.
 */
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


  parse_next(): ParseResult
  {
    if (this.i >= this.length) {
      return ParseResult.DONE;
    }

    INCANTATION: {
      if (this.source[this.i] !== "/") break INCANTATION;

      let incantation = this.try_parse_any_incantation();
      if (incantation === ParseResult.RECOVERABLE_FAIL) break INCANTATION;
    }

    return this.parse_line();

      // check if /
        // if so, read until we find ::
        // if no :: found, bail and set line as LaTeX
          // if found:
            // slice
            // parse
            // keep reading until end of line
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
      kind: ParseResult.Kind.EXPRESSION,
      data: {
        latex: line,
      },
    };
  }


  /**
   * Parse any incantation. Throws if no valid incantation can be parsed.
   */
  try_parse_any_incantation(): Incantation | ParseResult.RecoverableFail
  {
    for (let incantation of ALL_INCANTATION_IDENTIFIERS) {
      let r = this.try_parse_incantation_identifier(incantation);
      if (r === ParseResult.RECOVERABLE_FAIL) continue;
      return incantation;
    }

    return ParseResult.RECOVERABLE_FAIL;
  }

  /**
   * Attempt to parse the identifier for `incantation`.
   * 
   * Returns `true` iff successful, otherwise backtracks and returns `FAIL`.
   * 
   * For instance, if `incantation` is `Incantation.VIEWPORT`, try to parse the literal `viewport`.
   */
  private try_parse_incantation_identifier(incantation: Incantation): true | ParseResult.RecoverableFail
  {
    let init = this.i;
    let ii = this.i;

    while (this.source[this.i] === incantation[ii]) {
      this.i++;
      ii++;

      if (ii === incantation.length) {
        return true;
      }
    }

    this.i = init;
    return ParseResult.RECOVERABLE_FAIL;
  }


  // == UTILS == //

  /**
   * Peek a snippet of the upcoming source text (for error messages).
   */
  preview(): string
  {
    return this.source.slice(this.i, this.i + 20);
  }
}
