import { Unrecoverable } from "../parser";


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
  Data = any,
>
{
  /** The raw text sequence that matches this identifier, such as `viewport` or `hidden`. */
  abstract readonly identifier: string


  /** Apply this incantation's effect to `target`, using the provided `data` if required. */
  abstract apply(
    target: Effect extends GLOBAL ? Desmos.Calculator : Desmos.ExpressionState,
    data?: Data,
  ): void
}


export abstract class DataIncantation<
  Effect extends Incantation.Effect = Incantation.Effect,
  Data = any,
>
  extends Incantation<Effect, Data>
{
  /** Does this incantation always require an argument to be passed? */
  requires_arg: boolean = true


  /**
   * Parse the argument provided to this incantation, throwing if an error is encountered.
   * 
   * If parsing is successful, the evaluated data is returned.
   * 
   * For instance, for `/viewport{ left: -1, right: 1 }`, this returns the POJO `{ left: -1, right: 1 }`.
   */
  abstract parse_arg(data: string): Unrecoverable<Data>
}


export namespace Incantation
{
  /** The kind of effect an incantation produces - it either modifies only one block, or modifies the calculator as a whole. */
  export enum Effect
  {
    /** An incantation that affects the entire Desmos calculator state. */
    GLOBAL,

    /** An incantation that affects only the expression immediately following it. */
    LOCAL,
  }
}


// == ERRORS == //

/** Desmost failed to apply an incantation. */
export class IncantationError extends Error {}


// == ALIASES == //

/** An incantation that affects the entire Desmos calculator state. */
export type GLOBAL = Incantation.Effect.GLOBAL;

/** An incantation that affects only the expression immediately following it. */
export type LOCAL = Incantation.Effect.LOCAL;
