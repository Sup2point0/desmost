import Json5 from "JSON5";

import type { Unrecoverable } from "../errors";


/**
 * An *Incantation* is like a slash command that tells <> to do something - like changing the properties of an expression, or applying some settings to the calculator as a whole.
 * 
 * Incantations must appear at the start of lines, prefixed by a `/`. They look like this:
 * 
 * ```math
 * /viewport{ left: -1, right: 1 }
 * /hidden :: x = 69
 * /text :: Never gonna give you up
 * ```
 */
export abstract class Incantation<
  Effect extends Incantation.Effect = Incantation.Effect,
>
{
  /** The raw text sequence that matches this incantation, such as `viewport` or `hidden`. */
  public abstract readonly identifier: string

  /** An alternative `.identifier`, strictly for localisation purposes only. */
  public readonly alias?: string


  /** Apply this incantation's effect to `target`, using the provided `data` if required. */
  public abstract apply(
    target: Effect extends GLOBAL ? Desmos.Calculator : Desmos.ExpressionState,
    data?: unknown,
  ): void
}


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
      case Incantation.ArgType.OBJECT: return Json5.parse(`{${raw}}`);
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


// == ERRORS == //

// FIXME not needed, use unified Recoverable/Unrecoverable

/** Desmost failed to apply an incantation. */
export class IncantationError extends Error {}


// == ALIASES == //

/** An incantation that affects the entire Desmos calculator state, like `/desmos` or `/viewport`. */
export type GLOBAL = Incantation.Effect.GLOBAL;

/** An incantation that affects only the expression immediately following it, like `/hide` or `/slider`. */
export type LOCAL = Incantation.Effect.LOCAL;

/** An incantation that produces an expression, like `/latex` or `/text`. */
export type EXPR = Incantation.Effect.EXPR;

