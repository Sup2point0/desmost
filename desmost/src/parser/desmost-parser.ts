import { GenericParser } from "./generic-parser";
import { Ast } from "./ast";

import type { DesmostOptions } from "../compiler";
import { FAIL, UnrecoverableError } from "../errors";
import type { RecoverableFail, Unrecoverable, MaybeRecoverable } from "../errors";
import * as utils from "../utils";

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

    else if (this.current === "/") {
      let r = this.parse_pre_sep();

      // 1 global
      if ("global" in r) {
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

      // note
      case "%":
        this.advance();
        let text = this.parse_line();

        return {
          kind: Ast.Kind.EXPRESSION,
          data: { type: "text", text },
          incantations: [],
        };

      // expr incantation
      case "/":
        let incantation = this.try_parse_expr_incantation();
        if (incantation !== FAIL) return incantation;
        // FALLTHROUGH: to fallback on plain LaTeX

      // plain LaTeX
      default:
        return {
          kind: Ast.Kind.EXPRESSION,
          data: { latex: this.parse_line() },
          incantations: [],
        };
    }
  }


  // == LOW-LEVEL == //

  /**
   * Parse a single line of arbitrary text.
   */
  parse_line(): Unrecoverable<string>
  {
    let init = this.i;

    while (!this.out_of_bounds() && this.current !== "\n") {
      this.advance();
    }

    return this.source.slice(init, this.i).trim();
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
   * Returns the raw text without `{}`.
   * 
   * ```ts
   * /incantation{ arg }
   *               ^^^
   * ```
   * 
   * ## Notes
   * 
   * We don't actually care for what type the argument is since we won't be evaluating it, we just want to find the closing `}`.
   * 
   * However, the argument itself might contain one or many `}`! So we need a way to accurately identify the actual closing brace:
   * 
   * ```ts
   * /incantation{ field: { value: 1 } }
   *                                 ^ ^
   * ```
   * 
   * In our context, we have the guarantee that any well-formed argument always has matching pairs of `{}`. So we'll keep track of a context stack that starts with the opening `{`, and when the stack is depleted, we must've reached the end of the argument.
   * 
   * However, there's still more edge cases:
   * 
   * ```ts
   * /label{ text: "This }s weird" }
   *                     ^
   * ```
   * 
   * `{` and `}` can appear in strings, and they won't necessarily be matched, so we'll ignore them by also tracking string contexts.
   * 
   * ```ts
   * /latex{ \{ x, y ) }
   *          ^
   * ```
   * 
   * `{` and `}` in LaTeX can be escaped with `\{` or `\}`, and these won't necessarily be matched, so we'll ignore them by also tracking escapes.
   * 
   * If the user truly mismatches `{}`, then, well ...parsing will fail catastrophically!
   * 
   * This method also handles parsing raw enum literals by converting them to strings. So this:
   * 
   * ```ts
   * /line{ style: DOTTED }
   *               ^^^^^^
   * ```
   * 
   * Produces `style: "DOTTED"` (instead of `style: DOTTED`, which would fail to later parse as JSON).
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

    /** The context stack to keep track of when the closing `}` is encountered. */
    let stack = new ContextStack();

    /** Indices at which to later insert `"` quotes. */
    let indices_to_insert_quotes: number[] = [];

    while (stack.length > 0) {
      // If the last character was an escape, we don't care at all what the next character is!
      // This handles \\ double escape perfectly fine, since the first negates the second
      if (stack.try_pop(Ctx.ESCAPE)) {
        this.advance(
          `Unexpected end of input while parsing incantation argument, stack: ${stack.debug()}`
        );
      }
      
      let top = stack.top!;

      switch (this.current)
      {
        case Char.BACKSLASH: stack.push(Ctx.ESCAPE); break;

        case "{":  stack.push(     Ctx.BLOCK, { unless: [Ctx.STR_1, Ctx.STR_2, Ctx.STR_F] }); break;
        case "}":  stack.force_pop(Ctx.BLOCK, { unless: [Ctx.STR_1, Ctx.STR_2, Ctx.STR_F] }); break;
      }

      if (arg_type === Incantation.ArgType.OBJECT)
      {
        if (top === Ctx.VALUE && this.current?.match(/[a-zA-Z]/)) {
          stack.push(Ctx.ENUM);
          indices_to_insert_quotes.push(this.i);
        }
        else if (top === Ctx.ENUM && this.current?.match(/[^a-zA-Z]/)) {
          stack.pop();
          indices_to_insert_quotes.push(this.i);

          if (indices_to_insert_quotes.length % 2 != 0) {
            console.error(`Desmost [INTERNAL]: Logic error in \`parse_incantation_arg()\`: Mismatched inserted quotes`);
          }
        }

        switch (this.current)
        {
          case ":": stack.push(Ctx.VALUE, { when: [Ctx.BLOCK] }); break;
          case ",": stack.try_pop(Ctx.VALUE); break;

          case Char.QUOTE_1:
            stack.pop_or_push(Ctx.STR_1, { unless: [Ctx.STR_2, Ctx.STR_F] });
            stack.try_pop(Ctx.VALUE);
            break;
          case Char.QUOTE_2:
            stack.pop_or_push(Ctx.STR_2, { unless: [Ctx.STR_1, Ctx.STR_F] });
            stack.try_pop(Ctx.VALUE);
            break;
          case Char.BACKTICK:
            stack.pop_or_push(Ctx.STR_F, { unless: [Ctx.STR_1, Ctx.STR_2] });
            stack.try_pop(Ctx.VALUE);
            break;
        }
      }

      this.advance(
        `Unexpected end of input while parsing incantation argument, stack: ${JSON.stringify(stack)}`
      );
    }

    /* NOTE: Cut in by 1 on both sides to exclude {} braces */
    let out = utils.chars(this.source, init + 1, this.i - 1);
    
    for (let [i, j] of utils.reversing(utils.paired(indices_to_insert_quotes))) {
      i -= init + 1;
      j -= init + 1;

      let value = out.slice(i, j).join("");
      if (["true", "false", "null", "undefined"].includes(value)) continue;
      
      out.splice(j, 0, `"`);
      out.splice(i, 0, `"`);
    }

    return out.join("").trim();
  }
}


class ContextStack
{
  #data: Ctx[] = [Ctx.BLOCK]

  get length(): number {
    return this.#data.length;
  }

  /** The currently active context. */
  get top(): Ctx {
    return this.#data.at(-1)!;
  }

  push(ctx: Ctx, options?: StackOperationOptions): boolean
  {
    if (this.#should_skip(options)) return false;

    this.#data.push(ctx);
    return true;
  }

  pop(): void
  {
    this.#data.pop();
  }

  /** Pop `ctx` if it is the currently active context, returning `true` if so. */
  try_pop(ctx: Ctx): boolean
  {
    if (this.top === ctx) {
      this.#data.pop();
      return true;
    } else {
      return false;
    }
  }

  /** Backtrack until `ctx` is popped. */
  force_pop(ctx: Ctx, options?: StackOperationOptions): boolean
  {
    if (this.#should_skip(options)) return false;

    let idx = this.#data.lastIndexOf(ctx);
    if (idx === -1) return false;

    /* NOTE: We could report errors for unterminated contexts, but we'll leave that for the actual evaluation - in case we get something wrong ;) */
    this.#data.splice(idx);
    return true;
  }

  /** Pop `ctx` if it is the current context, else push it onto the stack. */
  pop_or_push(ctx: Ctx, options?: StackOperationOptions): boolean
  {
    if (this.#should_skip(options)) return false;

    this.try_pop(ctx) || this.push(ctx);
    return true;
  }

  debug(): string {
    return JSON.stringify(this.#data);
  }

  #should_skip(options: StackOperationOptions | undefined): boolean
  {
    return Boolean(
        options?.when != undefined && !options?.when?.includes(this.top)
      || options?.unless?.includes(this.top)
    );
  }
}

interface StackOperationOptions
{
  /** Only perform this operation if the current context is any of these. */
  when?: Ctx[];

  /** Don't perform this operation if the current context is any of these. */
  unless?: Ctx[];
}

enum Char
{
  BACKSLASH = "\\",
  QUOTE_1   = `'`,
  QUOTE_2   = `"`,
  BACKTICK  = "`",
}

enum Ctx {
  BLOCK  = "{",
  VALUE  = ":",
  ENUM   = "<enum literal>",
  STR_1  = Char.QUOTE_1,
  STR_2  = Char.QUOTE_2,
  STR_F  = Char.BACKTICK,
  ESCAPE = Char.BACKSLASH,
}
