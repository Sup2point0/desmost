import { GenericParser } from "./generic-parser";
import { Ast } from "./ast";

import { FAIL, UnrecoverableError } from "../errors";
import type { RecoverableFail, Unrecoverable, MaybeRecoverable } from "../errors";

import {
  Incantation, ArgIncantation,
  GLOBAL_INCANTATIONS, LOCAL_INCANTATIONS, EXPR_INCANTATIONS
} from "../magic";
import type { GLOBAL, LOCAL, EXPR } from "../magic";

import type { DesmostOptions } from "../compiler";


/**
 * A stateful lazy parser for Desmost.
 */
export class DesmostParser extends GenericParser
{
  constructor(source: string, protected options?: DesmostOptions)
  {
    super(source + "\n");
  }


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

      if (incantations.length > 0) {
        this.parse_sep();
      }

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
                | Ast.InvalidInvocation;
      }
      | { local: Array<Ast.IncantationInvocation<LOCAL>
                      | Ast.InvalidInvocation>;
      }
    >
  {
    // 1 global incantation
    let r = this.try_parse_global_incantation();

    if (r !== FAIL) {
      this.consume_end_of_block(
        `Received excess input after global incantation /${r.incantation.identifier}`
      );

      return { global: r };
    }

    // 1+ local incantations
    let incantations = [];

    while (this.current === "/") {
      let invocation = this.try_parse_local_incantation();
      if (invocation === FAIL) break;
      incantations.push(invocation);
    }

    return { local: incantations };
  }

  /**
   * Parse the Desmost `::` separator.
   */
  parse_sep(): Unrecoverable<void>
  {
    this.consume_whitespace();
    this.consume("::",
      `Expected \`::\` separator between local incantations and expression, but found: \`${this.preview()}\``
    );
    this.consume_whitespace();
  }

  /**
   * Parse Desmost syntax after the `::` separator, which may be:
   * 
   * - 1 line of LaTeX
   * - 1 expression incantation
   */
  parse_post_sep(): Unrecoverable<Ast.Expression>
  {
    this.consume_spaces();

    switch (this.current) {
      // empty block
      case "\n":
        return {
          kind: Ast.Kind.EXPRESSION,
          data: { latex: ` ` },
          incantations: [],
        };

      // expr incantation
      case "/":
        let incantation = this.try_parse_expr_incantation();
        if (incantation !== FAIL) return incantation;
        else {
          // plain LaTeX (fallback)
          return this.parse_latex_line();
        }

      // plain LaTeX
      default:
        return this.parse_latex_line();
    }
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
      data: { latex: this.source.slice(init, this.i).trimEnd() },
      incantations: [],
    };
  }


  /**
   * Attempt to parse a global incantation invocation.
   */
  try_parse_global_incantation():
    | Ast.IncantationInvocation<GLOBAL>
    | Ast.InvalidInvocation
    | RecoverableFail
  {
    let init = this.i;

    if (this.try_consume("/") === FAIL) return FAIL;

    let incantation = this.try_parse_identifier(GLOBAL_INCANTATIONS);
    if (incantation === FAIL) {
      this.i = init;
      return FAIL;
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
            `No argument provided for /${incantation.identifier}, which requires an argument of type: \`${incantation.arg_type}\``
          )
        };
      }
    }

    this.consume_spaces();

    // @ts-expect-error: FIXME
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
    | Ast.IncantationInvocation<LOCAL>
    | Ast.InvalidInvocation
    | RecoverableFail
  {
    let init = this.i;

    if (this.try_consume("/") === FAIL) return FAIL;

    let incantation = this.try_parse_identifier(LOCAL_INCANTATIONS);
    if (incantation === FAIL) {
      this.i = init;
      return FAIL;
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
            `No argument provided for /${incantation.identifier}, which requires an argument of type: \`${incantation.arg_type}\``
          )
        };
      }
    }

    this.consume_whitespace();

    // @ts-expect-error: FIXME
    return {
      kind: Ast.Kind.INCANTATION_INVOCATION,
      incantation,
      arg_raw,
    };
  }

  try_parse_expr_incantation(): MaybeRecoverable<Ast.Expression>
  {
    let init = this.i;

    if (this.try_consume("/") === FAIL) return FAIL;

    let incantation = this.try_parse_identifier(EXPR_INCANTATIONS);
    if (incantation === FAIL) {
      // TODO maybe flag to user
      this.i = init;
      return FAIL;
    }

    let arg_raw = this.parse_incantation_arg((incantation as ArgIncantation<EXPR>).arg_type);

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
  ): Incantation<Effect> | RecoverableFail
  {
    for (let incantation of incantations) {
      // yeah the duplication here is a little meh, unfortunately needing `return` means we can't extract it into a helper
      let r = this.try_consume(incantation.identifier);
      if (r !== FAIL) return incantation;

      if (incantation.alias != undefined) {
        let r = this.try_consume(incantation.alias);
        if (r !== FAIL) return incantation;
      }
    }

    return FAIL;
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
      `Expected \`{\` to start incantation argument, but found: \`${this.preview()}\``
    );

    enum Ctx { BLOCK, VALUE, STR_1, STR_2, STR_F, ESCAPE }

    let stack: Ctx[] = [Ctx.BLOCK];

    /** Pop `ctx` from the context stack if it is the currently active context, returning `true` if so. */
    function try_pop(ctx: Ctx): boolean
    {
      if (stack.at(-1) === ctx) {
        stack.pop();
        return true;
      } else {
        return false;
      }
    }

    /** Backtrack the stack until `ctx` is popped from the context stack. */
    function force_pop(ctx: Ctx): void
    {
      let idx = stack.lastIndexOf(ctx);
      if (idx !== -1) {
        stack.splice(idx);
      }

      /* NOTE: We could report errors for unterminated contexts, but we'll leave that for the actual evaluation - in case we get something wrong ;) */
    }

    while (stack.length > 0) {
      if (try_pop(Ctx.ESCAPE)) {
        this.advance(
          `Unexpected end of input while parsing incantation argument, stack: ${JSON.stringify(stack)}`
        );
      }
      
      let top = stack.at(-1)!;

      switch (this.current)
      {
        case Char.BACKSLASH:
          stack.push(Ctx.ESCAPE);
          break;

        case Char.L_BRACE:
          if ([Ctx.STR_1, Ctx.STR_2, Ctx.STR_F].includes(top)) break;
          stack.push(Ctx.BLOCK);
          break;

        case Char.R_BRACE:
          if ([Ctx.STR_1, Ctx.STR_2, Ctx.STR_F].includes(top)) break;
          force_pop(Ctx.BLOCK);
          break;
      }

      if (arg_type === Incantation.ArgType.OBJECT) {
        switch (this.current)
        {
          case Char.COLON:
            if (top !== Ctx.BLOCK) break;
            stack.push(Ctx.VALUE);
            break;

          case Char.QUOTE_SINGLE:
            if (top === Ctx.STR_2 || top === Ctx.STR_F) break;
            try_pop(Ctx.STR_1) || stack.push(Ctx.STR_1);
            break;
            
          case Char.QUOTE_DOUBLE:
            if (top === Ctx.STR_1 || top === Ctx.STR_F) break;
            try_pop(Ctx.STR_2) || stack.push(Ctx.STR_2);
            break;

          case Char.BACKTICK:
            if (top === Ctx.STR_1 || top === Ctx.STR_2) break;
            try_pop(Ctx.STR_F) || stack.push(Ctx.STR_F);
            break;
        }
      }

      this.advance(
        `Unexpected end of input while parsing incantation argument, stack: ${JSON.stringify(stack)}`
      );
    }

    /* NOTE: Cut in by 1 on both sides to exclude {} braces */
    return this.source.slice(init + 1, this.i - 1).trim();
  }

}


enum Char
{
  L_BRACE      = "{",
  R_BRACE      = "}",
  COLON        = ":",
  QUOTE_SINGLE = `'`,
  QUOTE_DOUBLE = `"`,
  BACKTICK     = "`",
  BACKSLASH    = "\\",
}
