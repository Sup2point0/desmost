import { ParseResult, RecoverableFail, UnrecoverableFail } from "./result";

import { Incantation, INCANTATIONS } from "../magic";


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

    if (this.current() === "/") {
      this.try_parse_pre_sep();
    }

    this.#try_parse_post_sep();

    // TODO
  }


  // == PROPERTIES == //

  /** Get the character the parser is currently pointing at, erroring if the parser has unexpectedly reached the end of the input. */
  private current(): string | UnrecoverableFail
  {
    let char = this.source.at(this.i);

    if (char == undefined) {
      throw new UnrecoverableFail("Unexpected end of input");
    }
    
    return char;
  }

  private get next(): string | undefined
  {
    return this.source.at(this.i + 1);
  }


  // == CORE == //

  /**
   * Peek a snippet of the upcoming source text (for error messages).
   */
  #preview(): string
  {
    return this.source.slice(this.i, this.i + 20);
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
    this.#try_parse("/block");
    this.#parse_spaces();
    return this.#parse_latex_block();
  }

  #parse_latex_block(): ParseResult.Expression | RecoverableFail
  {
    this.#try_parse("{");
    
    let init = this.i;

    while (this.current() !== "\n" && this.next !== "}") {
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

    while (this.i < this.length && this.current() !== "\n") {
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
        this.#try_parse(incantation.identifier);
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
   * Parse `raw`.
   */
  #expect(raw: string, error_message?: string): true | UnrecoverableFail
  {
    try {
      this.#try_parse(raw);
    }
    catch (e) {
      if (e instanceof RecoverableFail) {
        throw new UnrecoverableFail(error_message ?? `Expected: ${raw}, found: ${this.#preview()}`)
      }
    }
  }

  /**
   * Attempt to parse `raw`.
   * 
   * Returns `true` iff successful, otherwise backtracks and throws.
   */
  #try_parse(raw: string): true | RecoverableFail
  {
    let init = this.i;
    let ii = this.i;

    while (this.current() === raw[ii]) {
      this.#advance();
      ii++;

      if (ii === raw.length) {
        return true;
      }
    }

    this.i = init;
    throw new RecoverableFail();
  }

  #parse_spaces()
  {
    while (this.current() === " ") {
      this.#advance();
    }
  }
}
