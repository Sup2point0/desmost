import { FAIL, UnrecoverableError } from "../errors";
import type { RecoverableFail, Unrecoverable } from "../errors";


const IGNORED_CHARACTERS = new Set([
  "\r",
]);


/**
 * A stateful lazy parser, providing core (non-Desmost-specific) methods for parsing.
 * 
 * Many methods come in `<verb>` and `try_<verb>` pairs. On parsing failure, the former throws an `UnrecoverableError`, but the latter instead backtracks and only returns a `RecoverableFail`. The former is for expected parses, while the latter is for speculative parsing.
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
   * 
   * Optionally start from the given `idx`.
   */
  public preview(idx?: number): string
  {
    idx ??= this.i;
    return this.source.slice(idx, idx + 20) + "...";
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

    this.#advance();
  }

  /**
   * Attempt to advance to the next character, skipping ignored characters.
   * 
   * Fails if the parser is the out-of-bounds *before* advancing.
   */
  protected try_advance(): void | RecoverableFail
  {
    if (this.out_of_bounds()) return FAIL;
    this.#advance();
  }

  #advance(): void
  {
    this.i++;

    // @ts-expect-error: `this.current == undefined` is a true negative
    if (IGNORED_CHARACTERS.has(this.current)) {
      this.advance();
    }
  }

  /**
   * Consume `raw`, erroring if `raw` was not found.
   */
  protected consume(raw: string, error_msg?: string): Unrecoverable<void>
  {
    if (this.out_of_bounds()) {
      throw new UnrecoverableError.UnexpectedEnd(
        `Unexpected end of input while trying to consume: \`${raw}\``
      );
    }

    let init = this.i;
    let ii = 0;

    while (this.current === raw[ii]) {
      this.advance(
        `Unexpected end of input while trying to consume: \`${raw}\`, at: \`${this.preview(init)}\``
      );

      ii++;
      if (ii === raw.length) return;
    }

    throw new UnrecoverableError.UnexpectedInput(
      error_msg ?? `Expected: \`${raw}\`, but found: \`${this.preview(init)}\``
    );
  }

  /**
   * Attempt to consume `raw`, backtracking if `raw` was not found.
   */
  protected try_consume(raw: string): void | RecoverableFail
  {
    let init = this.i;
    let ii = 0;

    while (this.current === raw[ii]) {
      let r = this.try_advance();
      if (r === FAIL) return FAIL;

      ii++;
      if (ii === raw.length) return;
      if (this.i === this.length) break;
    }

    this.i = init;
    return FAIL;
  }

  /**
   * Consume 0 or more space characters.
   */
  protected consume_spaces(): void
  {
    /* NOTE: Callers should be able to assume this is safe to call even when at end of input, since it should just match 0 characters */
    if (this.out_of_bounds()) return;

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

    this.consume_spaces();

    this.consume("\n",
      error_msg ?? `Expected end of block, but found: \`${this.preview()}\``
    );
  }
}
