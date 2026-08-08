import { GenericParser } from "./generic-parser";

import { ParseResult } from "./result";
import { RecoverableFail, UnrecoverableError } from "./errors";
import type { Recoverable, Unrecoverable, MaybeRecoverable } from "./errors";

import {
  Incantation, ArgIncantation,
  GLOBAL, LOCAL,
  GLOBAL_INCANTATIONS, LOCAL_INCANTATIONS,
} from "../magic";


/**
 * A stateful lazy parser for Desmost.
 */
export class DesmostParser extends GenericParser
{
  /**
   * Parse the next semantic block of source code.
   */
  parse_next(): ParseResult
  {
    if (this.out_of_bounds()) {
      return ParseResult.DONE;
    }

    this.consume_spaces();

    if (this.current === "/") {
      let r = this.parse_pre_sep();

      if ("global" in r) {
        return r.global;
      }
      else {
        let incantations = r.local;

        let expr = this.try_parse_post_sep();

        for (let instance of incantations) {
          expr.incantations.push(instance);
        }

        return expr;
      }
    }
    else {
      return this.try_parse_post_sep();
    }
  }


  // == POST == //

  try_parse_post_sep(): ParseResult.Expression
  {
    this.consume_spaces();

    if (this.current === "\n") {
      return {
        kind: ParseResult.Kind.EXPRESSION,
        data: { latex: `` },
        incantations: [],
      };
    }

    return this.parse_latex_line();
  }

  // FIXME
  try_parse_latex_block(): Recoverable<ParseResult.Expression>
  {
    this.try_consume("/block");
    this.consume_spaces();
    return this.parse_latex_block();
  }

  parse_latex_block(): Recoverable<ParseResult.Expression>
  {
    this.try_consume("{");
    
    let init = this.i;

    while (this.current !== "\n" && this.next() !== "}") {
      this.advance();
    }

    let block = this.source.slice(init, this.i);

    return {
      kind: ParseResult.Kind.EXPRESSION,
      data: {
        latex: block.trim(),
      },
      incantations: [],
    };
  }

  /**
   * Parse a single line of LaTeX.
   */
  parse_latex_line(): ParseResult.Expression
  {
    let init = this.i;

    while (!this.out_of_bounds() && this.current !== "\n") {
      this.advance();
    }

    this.i++;

    let line = this.source.slice(init, this.i);

    return {
      kind: ParseResult.Kind.EXPRESSION,
      data: {
        latex: line,
      },
      incantations: [],
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
    MaybeRecoverable<
      | { global: ParseResult.IncantationInstance<GLOBAL>
                | ParseResult.InvalidIncantation;
      }
      | { local: Array<ParseResult.IncantationInstance<LOCAL>
                      | ParseResult.InvalidIncantation>;
      }
    >
  {
    // 1 global incantation
    try {
      let r = this.try_parse_global_incantation();

      this.consume_end_of_block(
        `Received excess input after global incantation /${r.incantation.identifier}`
      );

      return { global: r };
    }
    catch (e) {
      if (!(e instanceof RecoverableFail)) throw e;
    }

    let incantations: ParseResult.IncantationInstance<LOCAL>[] = [];

    // 1+ local incantations
    while (this.current === "/") {
      this.try_parse_local_incantation();
    }

    return { local: incantations };
  }

  /**
   * Attempt to parse a global incantation invocation.
   */
  try_parse_global_incantation():
    Recoverable<
    | ParseResult.IncantationInstance<GLOBAL>
    | ParseResult.InvalidIncantation
    >
  {
    this.try_consume("/");

    let incantation = this.try_parse_incantation_identifier(GLOBAL_INCANTATIONS);
    let data = undefined;

    if (incantation instanceof ArgIncantation) {
      if (this.current === "{") {
        data = this.parse_arg(incantation.arg_type);
      }
      else if (incantation.requires_arg) {
        return {
          kind: ParseResult.Kind.INVALID_INCANTATION,
          incantation,
          error: new UnrecoverableError.MissingInput(
            `No argument provided for /${incantation.identifier}, which requires an argument of type: ${incantation.arg_type}`
          )
        };
      }
    }

    this.consume_spaces();

    return {
      kind: ParseResult.Kind.INCANTATION_INSTANCE,
      incantation,
      arg_raw: data,
    };
  }

  /**
   * Attempt to parse a local incantation invocation.
   */
  try_parse_local_incantation():
    Recoverable<
    | ParseResult.IncantationInstance<LOCAL>
    | ParseResult.InvalidIncantation
    >
  {
    this.try_consume("/");

    let incantation = this.try_parse_incantation_identifier(LOCAL_INCANTATIONS);
    let data = undefined;

    if (incantation instanceof ArgIncantation) {
      if (this.current === "{") {
        data = this.parse_arg(incantation.arg_type);
      }
      else if (incantation.requires_arg) {
        return {
          kind: ParseResult.Kind.INVALID_INCANTATION,
          incantation,
          error: new UnrecoverableError.MissingInput(
            `No argument provided for /${incantation.identifier}, which requires an argument of type: ${incantation.arg_type}`
          )
        };
      }
    }

    this.consume_whitespace();

    return {
      kind: ParseResult.Kind.INCANTATION_INSTANCE,
      incantation,
      arg_raw: data,
    };
  }

  /**
   * Attempt to parse an incantation identifier.
   */
  try_parse_incantation_identifier<Effect extends Incantation.Effect>
  (
    incantations: Incantation<Effect>[]
  ): Recoverable<Incantation<Effect>>
  {
    for (let incantation of incantations) {
      try {
        this.try_consume(incantation.identifier);
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
   * Parse an argument to an incantation, enclosed in `{}`.
   * 
   * ```ts
   * /incantation{ arg }
   *             ^^^^^^^
   * ```
   * 
   * ## Notes
   * 
   * We don't actually care for what type the argument is since we won't be evaluating it, we just want to find the closing `}`.
   * 
   * However, the argument itself might be *meant* to contain a `}`. So we need a way to accurately identify the actual closing brace:
   * 
   * ```ts
   * /incantation{ field: { value: 1 } }
   *                                 ^ ^
   * ```
   * 
   * A well-formed argument always has matching pairs of `{}`, so we'll keep a stack. It starts with the opening `{`. When the stack is depleted, we must've reached the end of the argument.
   * 
   * However, there's still more edge cases:
   * 
   * ```ts
   * /label{ text: "This }s weird" }
   *              ^
   * ```
   * 
   * `{` and `}` can appear in strings, and they won't necessarily be matched, so we'll ignore them by also tracking string contexts.
   * 
   * ```ts
   * /latex{ \{ x, y ) }
   *          ^
   * ```
   * 
   * `{` and `}` in LaTeX can be escaped with `\{` or `\}`, and these won't necessarily be matched, so we'll ignore them by also tracking backslash escapes.
   * 
   * If the user truly mismatches `{}`, then, well ...parsing will fail catastrophically!
   */
  parse_arg(
    /**
     * The type of argument to parse.
     * 
     * Parsing strategy varies for different types:
     * 
     * - String / LaTeX: Track only balanced `{}` and escaped `\{\}`.
     * - JavaScript object: The above, plus balanced string quotes.
     */
    arg_type: Incantation.ArgType,
  ): Unrecoverable<string>
  {
    let init = this.i;

    this.consume("{",
      `Expected '{' to start incantation argument, but received: ${this.preview()}`
    );

    enum Ctx {
      BLOCK  = Char.L_BRACE,
      STR_1  = Char.QUOTE_SINGLE,
      STR_2  = Char.QUOTE_DOUBLE,
      STR_F  = Char.BACKTICK,
      ESCAPE = Char.BACKSLASH,
    }

    let stack: Ctx[] = [Ctx.BLOCK];

    /**
     * Pop `ctx` if it is the currently active context, returning `true` if successful.
     * 
     * If `{ force: true }`, backtrack the stack and report errors for unterminated contexts.
    */
    function try_pop(ctx: Ctx, options?: { force: boolean }): boolean
    {
      if (stack.at(-1) === ctx) {
        stack.pop();
        return true;
      }
      else if (options?.force) {
        if (stack.includes(ctx)) {
          /* NOTE: We could report errors for unterminated contexts, but we'll leave that for the actual evaluation - in case we get something wrong ;) */
          while (stack.at(-1) !== ctx) {
            stack.pop();
          }

          return true;
        }
      }

      return false;
    }

    while (stack.length > 0) {
      let top = stack.at(-1)!;

      if (try_pop(Ctx.ESCAPE)) {
        this.advance(
          `Unexpected end of input while parsing incantation argument, stack: ${JSON.stringify(stack)}`
        );
      }

      switch (this.current) {
        case Ctx.ESCAPE: stack.push(Ctx.ESCAPE); break;

        /* NOTE: *Currently* `{}` should be ignored in all contexts except `Ctx.BLOCK`. This might change if more contexts are added in future! */
        case Char.L_BRACE:
          if (top !== Ctx.BLOCK) break;
          stack.push(Ctx.BLOCK); break;

        case Char.R_BRACE:
          if (top !== Ctx.BLOCK) break;
          try_pop(Ctx.BLOCK, { force: true }); break;
      }

      if (arg_type === Incantation.ArgType.OBJECT) {
        switch (this.current) {
          case Ctx.STR_1: try_pop(Ctx.STR_1) || stack.push(Ctx.STR_1); break;
          case Ctx.STR_2: try_pop(Ctx.STR_2) || stack.push(Ctx.STR_2); break;
          case Ctx.STR_F: try_pop(Ctx.STR_F) || stack.push(Ctx.STR_F); break;
        }
      }

      this.advance();
    }

    /* NOTE: Cut in by 1 on both sides to exclude {} braces */
    return this.source.slice(init + 1, this.i - 1).trim();
  }

}


enum Char
{
  L_BRACE      = "{",
  R_BRACE      = "}",
  QUOTE_SINGLE = `'`,
  QUOTE_DOUBLE = `"`,
  BACKTICK     = "`",
  BACKSLASH    = "\\",
}
