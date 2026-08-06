import { ParseResult, RecoverableFail, UnrecoverableFail } from "./result";
import type { Recoverable } from "./result";

import { Incantation, GLOBAL_INCANTATIONS } from "../magic";


/**
 * Stateful lazy parser.
 */
export class Parser
{
  /** The source code this parser is parsing. */
  private source: string;

  /** The current position in the source code the parser is pointing to. */
  private i: number = 0;

  /** The number of characters in the source code. */
  private length: number;


  /** Create a parser for parsing `source`. */
  constructor(source: string)
  {
    this.source = source;
    this.length = source.length;
  }


  // == PUBLIC == //

  /**
   * Parse the next semantic block of source code.
   */
  parse_next(): ParseResult
  {
    if (this.i >= this.length) {
      return ParseResult.DONE;
    }

    if (this.current() === "/") {
      this.try_parse_pre_sep();
    }

    let expr = this.try_parse_post_sep();

    return expr;
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

  private next(): string | undefined
  {
    return this.source.at(this.i + 1);
  }


  // == CORE == //

  /**
   * Peek a snippet of the upcoming source text (for error messages).
   */
  preview(): string
  {
    return this.source.slice(this.i, this.i + 20);
  }

  advance()
  {
    this.i++;

    if (this.i > this.length) {
      throw new UnrecoverableFail("Unexpected end of input");
    }
  }


  // == POST == //

  try_parse_post_sep(): ParseResult.Expression
  {
    this.consume_spaces();

    try {
      return this.try_parse_latex_block() as ParseResult.Expression;
    }
    catch (e) {
      if (e instanceof RecoverableFail) {
        return this.parse_latex_line();
      }

      throw e;
    }
  }

  try_parse_latex_block(): Recoverable<ParseResult.Expression>
  {
    this.try_parse("/block");
    this.consume_spaces();
    return this.parse_latex_block();
  }

  parse_latex_block(): Recoverable<ParseResult.Expression>
  {
    this.try_parse("{");
    
    let init = this.i;

    while (this.current() !== "\n" && this.next() !== "}") {
      this.advance();
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
  parse_latex_line(): ParseResult.Expression
  {
    let init = this.i;

    while (this.i < this.length && this.current() !== "\n") {
      this.advance();
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
   * Attempt to parse an incantation identifier.
   * 
   * Returns the successfully matched incantation if found, otherwise backtracks and throws.
   */
  try_parse_global_incantation_identifier(): Recoverable<Incantation>
  {
    for (let incantation of GLOBAL_INCANTATIONS) {
      try {
        this.try_parse(incantation.identifier);
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
  expect(raw: string, error_message?: string): Recoverable<void>
  {
    try {
      this.try_parse(raw);
    }
    catch (e) {
      if (e instanceof RecoverableFail) {
        throw new UnrecoverableFail(error_message ?? `Expected: ${raw}, found: ${this.preview()}`)
      }
    }
  }

  /**
   * Attempt to parse `raw`, backtracking and throwing if `raw` was not found.
   */
  try_parse(raw: string): Recoverable<void>
  {
    let init = this.i;
    let ii = this.i;

    while (this.current() === raw[ii]) {
      this.advance();
      ii++;

      if (ii === raw.length) {
        return;
      }
    }

    this.i = init;
    throw new RecoverableFail();
  }

  /**
   * Consume 0 or more space characters.
   */
  consume_spaces(): void
  {
    while (this.current() === " ") {
      this.advance();
    }
  }
}
