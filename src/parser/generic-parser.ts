import { RecoverableFail, UnrecoverableError } from "./errors";
import type { Recoverable, Unrecoverable } from "./errors";


/**
 * Stateful lazy parser.
 */
export class GenericParser
{
  /** The source code this parser is parsing. */
  protected source: string;

  /** The current position in the source code the parser is pointing to. */
  protected i: number = 0;

  /** The number of characters in the source code. */
  protected length: number;


  /** Create a parser for parsing `source`. */
  constructor(source: string)
  {
    this.source = source;
    this.length = source.length;
  }


  /** Get the character the parser is currently pointing at, erroring if the parser has unexpectedly reached the end of the input. */
  protected current(): string | UnrecoverableError
  {
    let char = this.source.at(this.i);

    if (char == undefined) {
      throw new UnrecoverableError("Unexpected end of input");
    }
    
    return char;
  }

  protected next(): string | undefined
  {
    return this.source.at(this.i + 1);
  }


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
      throw new UnrecoverableError("Unexpected end of input");
    }
  }

  /**
   * Consume `raw`, erroring if `raw` was not found.
   */
  consume(raw: string, error_message?: string): Unrecoverable<void>
  {
    try {
      this.try_parse(raw);
    }
    catch (e) {
      if (e instanceof RecoverableFail) {
        throw new UnrecoverableError(error_message ?? `Expected: ${raw}, found: ${this.preview()}`)
      }
    }
  }

  /**
   * Attempt to consume `raw`, backtracking and throwing if `raw` was not found.
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
