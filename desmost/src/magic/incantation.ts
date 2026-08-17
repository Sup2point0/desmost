import Json5 from "json5";

import { UnrecoverableError, type Unrecoverable } from "../errors";


/**
 * An *Incantation* is like a slash command that tells Desmost to do something - like changing the properties of an expression, or applying some settings to the calculator as a whole.
 * 
 * Incantations must be prefixed by a `/`. They look like this:
 * 
 * ```math
 * /viewport{ left: -1, right: 1 }
 * /hidden :: x = 69
 * /text :: Never gonna give you up
 * ```
 * 
 * Incantations that accept an argument derive from `ArgIncantation`.
 */
export abstract class Incantation<
  Effect extends Incantation.Effect = Incantation.Effect
>
{
  /** Short user-facing description of what the incantation does. */
  public abstract readonly description: string

  /** The raw text sequence that matches this incantation, such as `viewport` or `hidden`. */
  public abstract readonly identifier: string

  /** An alternative `.identifier`, strictly for localisation purposes only. */
  public readonly alias?: string


  /** Apply this incantation's effect to `target`, using the provided `data` if required. */
  public abstract apply(
    target: Effect extends GLOBAL ? Desmos.Calculator : Desmos.ExpressionState,
    data?: unknown,
  ): void

  /** Error if the `actual` type of the given expression is not `required`. */
  protected require_expr_type<T extends Desmos.ExpressionState["type"]>(
    actual: unknown,
    required: T,
  ): asserts actual is T
  {
    if ((actual ?? "expression") !== required)
    {
      throw new UnrecoverableError.IllegalIncantation(
        `/${this.identifier} can only applied to ${required === "expression" ? "latex" : required} expressions, but target block has type: ${actual}`
      );
    }
  }
}


/**
 * An incantation that accepts an argument.
 */
export abstract class ArgIncantation<
  Effect extends Incantation.Effect = Incantation.Effect
>
  extends Incantation<Effect>
{
  /** Does this incantation always require an argument to be passed? */
  public readonly requires_arg: boolean = true

  /** What type of argument does this incantation accept? */
  public abstract readonly arg_type: Incantation.ArgType


  /**
   * Evaluate the argument provided to this incantation, throwing if an error is encountered.
   * 
   * For instance, for `/viewport{ left: -1, right: 1 }`, this returns the POJO `{ left: -1, right: 1 }`.
   * 
   * ## Notes
   * 
   * Child incantation classes should override this method, though the defaults should cover most cases (except `ArgType.ENUM`).
   */
  public evaluate_arg(raw: string): Unrecoverable<unknown>
  {
    switch (this.arg_type) {
      case Incantation.ArgType.STRING: return raw;
      case Incantation.ArgType.LATEX:  return raw;
      case Incantation.ArgType.ENUM:   return raw;
      
      case Incantation.ArgType.OBJECT: {
        try {
          return Json5.parse(`{${raw}}`);
        }
        catch (e) {
          // @ts-expect-error: fine
          throw new UnrecoverableError.InvalidArgument(e.message);
        }
      }
    }
  }
}


export namespace Incantation
{
  /** The kind of effect an incantation produces - it either modifies only one block, or modifies the calculator as a whole. */
  export enum Effect
  {
    /** An incantation that affects the entire Desmos calculator state, like `/desmos` or `/viewport`. */
    GLOBAL,

    /** An incantation that affects only the expression immediately following it, like `/hide` or `/slider`. */
    LOCAL,
    
    /** An incantation that produces an expression, like `/latex` or `/text`. */
    EXPR,
  }

  /** The type of argument an incantation accepts, which affects how it is parsed. */
  export enum ArgType
  {
    /** Any arbitrary user text content, where characters like `"` and `'` don't have semantic meaning and can be ignored. */
    STRING = "String",

    /** LaTeX, which should have balanced `{}` braces. */
    LATEX = "LaTeX",

    /** Specific value from an allowed set of values, which will map to an enum value in the Desmos API. */
    ENUM = "Enum",

    /** JavaScript object fields, where characters like `{}` and `"` all have semantic meaning, and must be balanced. */
    OBJECT = "Object",
  }
}


// == ALIASES == //

/** An incantation that affects the entire Desmos calculator state, like `/desmos` or `/viewport`. */
export type GLOBAL = Incantation.Effect.GLOBAL;

/** An incantation that affects only the expression immediately following it, like `/hide` or `/slider`. */
export type LOCAL = Incantation.Effect.LOCAL;

/** An incantation that produces an expression, like `/latex` or `/text`. */
export type EXPR = Incantation.Effect.EXPR;

