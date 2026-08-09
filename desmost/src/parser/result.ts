import { UnrecoverableError } from "./errors";

import { Incantation, ArgIncantation } from "../magic";


export namespace ParseResult
{
  /** What kind of parse result this is. */
  export enum Kind
  {
    DONE = "Done",
    EXPRESSION = "Expression",
    INCANTATION_INVOCATION = "Incantation-Invocation",
    INVALID_INCANTATION = "Invalid-Incantation",
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
      | IncantationInvocation<Incantation.Effect.LOCAL>
      | ArgIncantationInvocation<Incantation.Effect.LOCAL>
      | InvalidIncantation
      >
  }


  /** A pending incantation invocation that requires applying its effect. */
  export interface IncantationInvocation<Effect extends Incantation.Effect = Incantation.Effect>
  {
    kind: Kind.INCANTATION_INVOCATION
    incantation: Incantation<Effect>
    
  }

  /** A pending incantation invocation that requires evaluating its argument, then applying its effect. */
  export interface ArgIncantationInvocation<Effect extends Incantation.Effect = Incantation.Effect>
    extends IncantationInvocation<Effect>
  {
    incantation: ArgIncantation<Effect>
    arg_raw: string
  }

  /**
   * An invalid invantation invocation that raised an error when parsed.
   * 
   * This will be propogated to the user as an extra Desmos text expression (unless they have `errors: false` configured).
   */
  export interface InvalidIncantation
  {
    kind: Kind.INVALID_INCANTATION
    incantation: Incantation
    arg_raw?: string
    error: UnrecoverableError
  }
}

/** An abstract object produced by parsing a block of source code. */
export type ParseResult =
  | ParseResult.Done
  | ParseResult.Expression
  | ParseResult.IncantationInvocation
  | ParseResult.ArgIncantationInvocation
  | ParseResult.InvalidIncantation
;
