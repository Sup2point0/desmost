import { UnrecoverableError } from "./errors";

import { Incantation } from "../magic";


export namespace ParseResult
{
  /** What kind of parse result this is. */
  export enum Kind
  {
    DONE = "Done",
    EXPRESSION = "Expression",
    INCANTATION_INSTANCE = "IncantationInstance",
    INVALID_INCANTATION = "InvalidIncantation",
  }


  /** The parser successfully reached the end of its source. */
  export interface Done { kind: Kind.DONE }

  /** Sentinel value to signal the parser successfully reached the end of its source. */
  export const DONE: Done = { kind: Kind.DONE };

  
  /** A Desmos expression to add to the calculator. */
  export interface Expression
  {
    kind: Kind.EXPRESSION
    data: Desmos.ExpressionState
    incantations: Array<
      | IncantationInstance<Incantation.Effect.LOCAL>
      | InvalidIncantation
      >
  }


  /** A pending incantation usage that requires parsing of `data`, and applying its effect. */
  export interface IncantationInstance<Effect extends Incantation.Effect = Incantation.Effect>
  {
    kind: Kind.INCANTATION_INSTANCE
    incantation: Incantation<Effect>
    arg_raw?: string
  }

  /**
   * An invalid invantation usage that raised an error when parsed.
   * 
   * This will be propogated to the user as an extra Desmos text expression (unless they have `errors: false` configured).
   */
  export interface InvalidIncantation
  {
    kind: Kind.INVALID_INCANTATION
    incantation: Incantation
    error: UnrecoverableError
    arg_raw?: string
  }
}

/** An abstract object produced by parsing a block of source code. */
export type ParseResult =
  | ParseResult.Done
  | ParseResult.Expression
  | ParseResult.IncantationInstance
  | ParseResult.InvalidIncantation
;
