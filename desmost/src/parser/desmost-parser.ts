import { GenericParser } from "./generic-parser";
import { Ast } from "./ast";

import { RecoverableFail, UnrecoverableError } from "../errors";
import type { Recoverable, Unrecoverable, MaybeRecoverable } from "../errors";

import {
  Incantation, ArgIncantation,
  GLOBAL_INCANTATIONS, LOCAL_INCANTATIONS, EXPR_INCANTATIONS
} from "../magic";
import type { GLOBAL, LOCAL, EXPR } from "../magic";


/**
 * A stateful lazy parser for Desmost.
 */
export class DesmostParser extends GenericParser
{
  // == TOP-LEVEL == //

  /**
   * Parse the next semantic block of source code, producing an `Ast` object, or `null` if the parser has successfully reached the end of the source code.
   */
  public parse_next(): Ast | null
  {
    this.consume_spaces();

    if (this.out_of_bounds()) {
      return null;
    }

    if (this.current === "/") {
      let r = this.parse_pre_sep();

      if ("global" in r) {
        // 1 global
        return r.global;
      }

      // 1+ locals + 1 expr
      let incantations = r.local;

      var expr = this.parse_post_sep();

      for (let invocation of incantations) {
        expr.incantations.push(invocation);
      }
    }
    else {
      // 1 expr
      var expr = this.parse_post_sep();
    }

    this.consume_end_of_block();
    return expr;
  }

  /**
   * Parse Desmost syntax before the `::` separator, which may be:
   * 
   * - 1 global incantation
   * - 1+ local incantations
   */
  parse_pre_sep():
    Unrecoverable<
      | { global: Ast.IncantationInvocation<GLOBAL>
                | Ast.InvalidIncantation;
      }
      | { local: Array<Ast.IncantationInvocation<LOCAL>
                      | Ast.InvalidIncantation>;
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

    let incantations = [];

    // 1+ local incantations
    while (this.current === "/") {
      try {
        incantations.push(this.try_parse_local_incantation());
      }
      catch (e) {
        if (!(e instanceof RecoverableFail)) throw e;
        break;
      }
    }

    if (incantations.length > 0) {
      this.parse_sep();
    }

    return { local: incantations };
  }

  parse_post_sep(): Unrecoverable<Ast.Expression>
  {
    this.consume_spaces();

    switch (this.current) {
      // empty block
      case "\n":
        return {
          kind: Ast.Kind.EXPRESSION,
          data: { latex: `` },
          incantations: [],
        };

      // expr incantation
      case "/":
        try {
          return this.try_parse_expr_incantation();
        }
        catch (e) {
          if (!(e instanceof RecoverableFail)) throw e;
          // plain LaTeX (fallback)
          return this.parse_latex_line();
        }

      // plain LaTeX
      default:
        return this.parse_latex_line();
    }
  }

  /**
   * Parse the Desmost `::` separator.
   */
  parse_sep(): Unrecoverable<void>
  {
    this.consume_whitespace();
    this.consume("::",
      `Expected '::' separator between local incantations and expression, but found: ${this.preview()}`
    );
  }


  // == LOW-LEVEL == //

  /**
   * Parse a single line of LaTeX.
   */
  parse_latex_line(): Unrecoverable<Ast.Expression>
  {
    let init = this.i;

    while (!this.out_of_bounds() && this.current !== "\n") {
      this.advance();
    }

    return {
      kind: Ast.Kind.EXPRESSION,
      data: { latex: this.source.slice(init, this.i) },
      incantations: [],
    };
  }


  /**
   * Attempt to parse a global incantation invocation.
   */
  try_parse_global_incantation():
    Recoverable<
    | Ast.IncantationInvocation<GLOBAL>
    | Ast.InvalidIncantation
    >
  {
    let init = this.i;

    this.try_consume("/");

    try {
      var incantation = this.try_parse_identifier(GLOBAL_INCANTATIONS);
    }
    catch (e) {
      if (e instanceof RecoverableFail) {
        this.i = init;
      }
      throw e;
    }

    let data = undefined;

    if (incantation instanceof ArgIncantation) {
      if (this.current === "{") {
        data = this.parse_incantation_arg(incantation.arg_type);
      }
      else if (incantation.requires_arg) {
        return {
          kind: Ast.Kind.INVALID_INCANTATION,
          incantation,
          error: new UnrecoverableError.MissingInput(
            `No argument provided for /${incantation.identifier}, which requires an argument of type: ${incantation.arg_type}`
          )
        };
      }
    }

    this.consume_spaces();

    return {
      kind: Ast.Kind.INCANTATION_INVOCATION,
      incantation,
      arg_raw: data,
    };
  }

  /**
   * Attempt to parse a local incantation invocation.
   */
  try_parse_local_incantation():
    Recoverable<
    | Ast.IncantationInvocation<LOCAL>
    | Ast.InvalidIncantation
    >
  {
    let init = this.i;

    this.try_consume("/");

    try {
      var incantation = this.try_parse_identifier(LOCAL_INCANTATIONS);
    }
    catch (e) {
      if (e instanceof RecoverableFail) {
        this.i = init;
      }
      throw e;
    }

    let arg_raw = undefined;

    if (incantation instanceof ArgIncantation) {
      if (this.current === "{") {
        arg_raw = this.parse_incantation_arg(incantation.arg_type);
      }
      else if (incantation.requires_arg) {
        return {
          kind: Ast.Kind.INVALID_INCANTATION,
          incantation,
          error: new UnrecoverableError.MissingInput(
            `No argument provided for /${incantation.identifier}, which requires an argument of type: ${incantation.arg_type}`
          )
        };
      }
    }

    this.consume_whitespace();

    return {
      kind: Ast.Kind.INCANTATION_INVOCATION,
      incantation,
      arg_raw,
    };
  }

  try_parse_expr_incantation(): MaybeRecoverable<Ast.Expression>
  {
    // TODO refactor with `backtrack()` helper
    let init = this.i;

    this.try_consume("/");

    try {
      var incantation = this.try_parse_identifier(EXPR_INCANTATIONS) as ArgIncantation<EXPR>;
    }
    catch (e) {
      if (e instanceof RecoverableFail) {
        // TODO maybe flag to user
        this.i = init;
      }
      throw e;
    }

    let arg_raw = this.parse_incantation_arg(incantation.arg_type);

    let data = {};
    incantation.apply(data, arg_raw);

    return {
      kind: Ast.Kind.EXPRESSION,
      data,
      incantations: [],
    };
  }

  /**
   * Attempt to parse an incantation identifier.
   */
  try_parse_identifier<Effect extends Incantation.Effect>(
    incantations: Incantation<Effect>[]
  ): Recoverable<Incantation<Effect>>
  {
    for (let incantation of incantations) {
      // yeah the duplication here is a little meh, unfortunately needing `return` means we can't extract it into a helper
      try {
        this.try_consume(incantation.identifier);
        return incantation;
      }
      catch (e) {
        if (!(e instanceof RecoverableFail)) throw e;
      }

      if (incantation.alias != undefined) {
        try {
          this.try_consume(incantation.alias);
          return incantation;
        }
        catch (e) {
          if (!(e instanceof RecoverableFail)) throw e;
        }
      }
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
  parse_incantation_arg(
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
      `Expected '{' to start incantation argument, but found: ${this.preview()}`
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
      if (try_pop(Ctx.ESCAPE)) {
        this.advance(
          `Unexpected end of input while parsing incantation argument, stack: ${JSON.stringify(stack)}`
        );
      }
      
      let top = stack.at(-1)!;

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
