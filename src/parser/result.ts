import { Incantation } from "../magic";


export namespace ParseResult
{
  /** What kind of parse result this is. */
  export enum Kind
  {
    DONE,
    INCANTATION,
    EXPRESSION,
  }

  /** The parser successfully reached the end of its source. */
  export interface Done { kind: Kind.DONE }

  /** Sentinel value to signal the parser successfully reached the end of its source. */
  export const DONE: Done = { kind: Kind.DONE };

  /** A usage of an incantation that will apply an effect with `data`. */
  export interface IncantationInstance<Effect extends Incantation.Effect = Incantation.Effect>
  {
    kind:        Kind.INCANTATION
    incantation: Incantation<Effect>
    data?:       any
  }

  /** A Desmos expression to add to the calculator. */
  export interface Expression
  {
    kind: Kind.EXPRESSION
    data: Desmos.ExpressionState
  }
}

/** An abstract object produced by parsing a block of source code. */
export type ParseResult =
  | ParseResult.Done
  | ParseResult.IncantationInstance
  | ParseResult.Expression
;
