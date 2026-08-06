import { GenericParser } from "./generic-parser";

import { ParseResult } from "./result";
import { RecoverableFail, UnrecoverableError } from "./errors";
import type { Recoverable, Unrecoverable } from "./errors";

import {
  Incantation, DataIncantation,
  GLOBAL, LOCAL,
  GLOBAL_INCANTATIONS, LOCAL_INCANTATIONS,
} from "../magic";


/**
 * Stateful lazy parser.
 */
export class DesmostParser extends GenericParser
{
  // == PUBLIC == //

  /**
   * Parse the next semantic block of source code.
   */
  parse_next(): ParseResult
  {
    if (this.i >= this.length) {
      return ParseResult.DONE;
    }

    let incantations: ParseResult.IncantationInstance[] = [];

    if (this.current() === "/") {
      let result = this.parse_pre_sep();

      // If not an array, that means it's a single global incantation
      if (!Array.isArray(result)) {
        return result;
      }

      incantations = result;
    }

    let expr = this.try_parse_post_sep();

    for (let instance of incantations) {
      instance.incantation.apply(expr.data, instance.data);  // TODO parse data
    }

    return expr;
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


  /**
   * Parse Desmost syntax before the `::` separator, which may be:
   * 
   * - 1 global incantation
   * - 1+ local incantations
   */
  parse_pre_sep():
    Unrecoverable<
        ParseResult.IncantationInstance<GLOBAL>
      | ParseResult.IncantationInstance<LOCAL>[]
    >
  {
    this.consume("/");

    // 1 global incantation
    try {
      var result = this.try_parse_global_incantation();

      this.consume_spaces();

      try { this.consume("\n"); }
      catch {
        throw new UnrecoverableError.UnexpectedInput(
          `Received excess input after global incantation /${result.incantation.identifier}`
        );
      }

      return result;
    }
    catch (e) {
      if (!(e instanceof RecoverableFail)) throw e;
    }

    // 1+ local incantations
    // TODO

    throw new UnrecoverableError();
  }

  /**
   * Attempt to parse a global incantation invocation.
   */
  try_parse_global_incantation(): Recoverable<ParseResult.IncantationInstance<GLOBAL>>
  {
    let incantation = this.try_parse_incantation_identifier(GLOBAL_INCANTATIONS);
    let data = undefined;

    if (incantation instanceof DataIncantation) {
      if (incantation.requires_arg) {
        if (this.current() !== "{") {
          throw new UnrecoverableError.MissingInput(
            `/${incantation.identifier} requires an argument`
          );
        }

        data = this.parse_arg();
      }
      else {
        if (this.current() === "{") {
          data = this.parse_arg();
        } else {
          this.consume_spaces();
        }
      }
    }

    return {
      kind: ParseResult.Kind.INCANTATION,
      incantation,
      data,
    };
  }

  /**
   * Attempt to parse an incantation identifier.
   */
  try_parse_incantation_identifier<
    Effect extends Incantation.Effect
  >(identifiers: Incantation<Effect>[]): Recoverable<Incantation<Effect>>
  {
    for (let incantation of identifiers) {
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

  /**
   * Parse an argument to an incantation.
   * 
   * Stops when either a `::` delimiter or the start of a new incantation is found, and backtracks to the `::` or `/`.
   */
  parse_arg(): Unrecoverable<string>
  {
    this.consume("{", `Expected '{' to start incantation argument, but received: ${this.preview()}`);
    // TODO difficult

    return "implementing!"
  }

}
