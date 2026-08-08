import { RecoverableFail, UnrecoverableError } from "./errors";
import type { Recoverable, Unrecoverable } from "./errors";


const IGNORED_CHARACTERS = new Set([
  "\r",
]);


/**
 * A stateful lazy parser, providing core methods for parsing.
 * 
 * Many methods come in `<verb>` and `try_<verb>` pairs. On parsing failure, the former throws an `UnrecoverableError`, but the latter instead backtracks and only throws a `RecoverableFail`.
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


  /**
   * Is the parser currently pointing at an invalid character?
   */
  protected out_of_bounds(): boolean
  {
    return this.i >= this.length;
  }

  /**
   * Get the character the parser is currently pointing at, or `undefined` if the parser is out-of-bounds.
   */
  protected get current(): string | undefined
  {
    return this.source.at(this.i);
  }

  /**
   * Get the character *after* the current one that the parser points at.
   */
  protected next(): string | undefined
  {
    return this.source.at(this.i + 1);
  }

  /**
   * Peek a snippet of the upcoming source text (for error messages).
   */
  protected preview(): string
  {
    return this.source.slice(this.i, this.i + 20);
  }

  /**
   * Advance to the next character, skipping ignored characters.
   * 
   * Errors if the parser is the out-of-bounds *before* advancing.
   */
  protected advance(error_msg?: string): Unrecoverable<void>
  {
    if (this.out_of_bounds()) {
      throw new UnrecoverableError.UnexpectedEnd(error_msg ?? "Unexpected end of input");
    }

    this.i++;

    // @ts-expect-error: `this.current == undefined` is a true negative
    if (IGNORED_CHARACTERS.has(this.current)) {
      this.advance();
    }
  }

  /**
   * Attempt to advance to the next character, skipping ignored characters.
   */
  protected try_advance(error_msg?: string): Recoverable<void>
  {
    try {
      this.advance(error_msg);
    }
    catch {
      throw new RecoverableFail();
    }
  }

  /**
   * Consume `raw`, erroring if `raw` was not found.
   */
  protected consume(raw: string, error_msg?: string): Unrecoverable<void>
  {
    try {
      this.try_consume(raw);
    }
    catch (e) {
      if (e instanceof RecoverableFail) {
        throw new UnrecoverableError.UnexpectedInput(
          error_msg ?? `Expected: ${raw}, but received: ${this.preview()}`
        );
      }
      throw e;
    }
  }

  /**
   * Attempt to consume `raw`, backtracking and throwing if `raw` was not found.
   */
  protected try_consume(raw: string): Recoverable<void>
  {
    if (this.out_of_bounds()) throw new RecoverableFail();

    let init = this.i;
    let ii = 0;

    while (this.current === raw[ii]) {
      this.try_advance(`Unexpected end of input while trying to consume: ${raw}`);
      ii++;

      if (ii === raw.length) return;
      if (this.i === this.length) break;
    }

    this.i = init;
    throw new RecoverableFail();
  }

  /**
   * Consume 0 or more space characters.
   */
  protected consume_spaces(): void
  {
    /* NOTE: Callers should be able to assume this is safe to call even when at end of input, since it should just match 0 characters */
    if (this.i >= this.length) return;

    while (this.current === " ") {
      this.advance();
    }
  }

  /**
   * Consume 0 or more whitespace characters.
   * 
   * Same as `.consume_spaces()`, but allows newlines.
   */
  protected consume_whitespace(): void
  {
    /* NOTE: Callers should be able to assume this is safe to call even when at end of input, since it should just match 0 characters */
    if (this.i >= this.length) return;

    while (this.current === " " || this.current === "\n") {
      this.advance();
    }
  }

  protected consume_end_of_block(error_msg?: string): Unrecoverable<void>
  {
    if (this.i >= this.length) return;

    try {
      this.try_consume("\n");
    }
    catch (e) {
      if (!(e instanceof RecoverableFail)) throw e;

      throw new UnrecoverableError.ExcessInput(
        error_msg ?? `Expected end of block, but received: ${this.preview()}`
      );
    }
  }
}
