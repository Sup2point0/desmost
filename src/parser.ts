import { Incantation, INCANTATIONS } from "./magic";


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


export class UnrecoverableFail extends Error {}
export class RecoverableFail extends Error {}


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


  // == PUBLIC == //

  parse_next(): ParseResult
  {
    if (this.i >= this.length) {
      return ParseResult.DONE;
    }

    if (this.current === "/") {
      this.try_parse_pre_sep();
    }

    this.#try_parse_post_sep();

    // TODO
  }


  // == PROPERTIES == //

  /** The character the parser is currently pointing at. */
  private get current(): string | UnrecoverableFail
  {
    let char = this.source.at(this.i);

    if (char == undefined) {
      throw new UnrecoverableFail("Unexpected end of input");
    }
    
    return char;
  }

  private get next(): string | undefined
  {
    return this.source[this.i + 1];
  }


  // == CORE == //

  #peek(char: string): boolean
  {
    return this.current === char;
  }

  #advance()
  {
    this.i++;

    if (this.i > this.length) {
      throw new UnrecoverableFail("Unexpected end of input");
    }
  }


  // == POST == //

  #try_parse_post_sep(): ParseResult.Expression | RecoverableFail
  {
    this.#parse_spaces();

    try {
      let out = this.#try_parse_latex_block();
      return out;
    }
    catch (e) {
      if (e instanceof RecoverableFail) {
        return this.#parse_latex_line();
      }

      throw e;
    }
  }

  #try_parse_latex_block(): ParseResult.Expression | RecoverableFail
  {
    this.#try_parse_raw("/block");
    this.#parse_spaces();
    return this.#parse_latex_block();
  }

  #parse_latex_block(): ParseResult.Expression | RecoverableFail
  {
    this.#try_parse_raw("{");
    
    let init = this.i;

    while (this.current !== "\n" && this.next !== "}") {
      this.#advance();
    }

    let block = this.source.slice(init, this.i);

    return {
      kind: ParseResult.Kind.EXPRESSION,
      data: {
        latex: block.trim(),
      }
    };
  }

  /**
   * Parse a single line of LaTeX.
   */
  #parse_latex_line(): ParseResult.Expression
  {
    let init = this.i;

    while (this.i < this.length && this.current !== "\n") {
      this.#advance();
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


  // == PRE == //


  try_parse_pre_sep(): null | RecoverableFail
  {
    // TODO
    throw new RecoverableFail();
  }


  /**
   * Attempt to parse an identifier for any incantation.
   * 
   * Returns the matching incantation iff successful, otherwise backtracks and throws.
   */
  try_parse_any_incantation_identifier(): Incantation | RecoverableFail
  {
    for (let incantation of INCANTATIONS) {
      try {
        this.#try_parse_raw(incantation.identifier);
      }
      catch (e) {
        if (e instanceof RecoverableFail) continue;
        throw e;
      }
      
      return incantation;
    }

    throw new RecoverableFail();
  }


  // == GENERAL == //

  /**
   * Attempt to parse `raw`.
   * 
   * Returns `true` iff successful, otherwise backtracks and throws.
   */
  #try_parse_raw(raw: string): true | ParseResult.RecoverableFail
  {
    let init = this.i;
    let ii = this.i;

    while (this.current === raw[ii]) {
      this.#advance();
      ii++;

      if (ii === raw.length) {
        return true;
      }
    }

    this.i = init;
    return ParseResult.RECOVERABLE_FAIL;
  }

  #parse_spaces()
  {
    while (this.current === " ") {
      this.#advance();
    }
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
