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
  Effect extends Incantation.EffectKind = Incantation.EffectKind,
  DataType = any
>
{
  /** The raw text sequence that matches this identifier, such as `viewport` or `hidden`. */
  abstract readonly identifier: string

  /** Whether this incantation expects data to be passed. */
  abstract readonly expect_data: Incantation.ExpectData


  /**
   * Parse data provided to this incantation, throwing if an error is encountered.
   * 
   * If parsing is successful, 
   */
  abstract parse_data(data: string): DataType


  /** Apply this incantation's effect to `target`, using the provided `data`. */
  abstract apply(
    target: Effect extends GLOBAL ? Desmos.Calculator : Desmos.ExpressionState,
    data: DataType,
  ): void
}


export namespace Incantation
{
  /** The type of effect an incantation has - it either modifies only one block, or modifies the calculator as a whole. */
  export enum EffectKind
  {
    /** An incantation that affects the entire Desmos calculator state. */
    GLOBAL,

    /** An incantation that affects only the expression immediately following it. */
    LOCAL,
  }

  /** Whether an incantation expects data to be passed. */
  export enum ExpectData
  {
    /** This incantation accepts no data. */
    NONE,
    
    /** This incantation optionally accepts data. */
    OPTIONAL,
    
    /** This incantation always requires data. */
    REQUIRED,
  }
}


/** An incantation that affects the entire Desmos calculator state. */
export type GLOBAL = Incantation.EffectKind.GLOBAL;

/** An incantation that affects only the expression immediately following it. */
export type LOCAL = Incantation.EffectKind.LOCAL;
