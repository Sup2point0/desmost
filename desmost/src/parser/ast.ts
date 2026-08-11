import { UnrecoverableError } from "../errors";
import { Incantation, ArgIncantation } from "../magic";


export namespace Ast
{
  /** What kind of parse result this is. */
  export enum Kind
  {
    EXPRESSION             = "Expression",
    INCANTATION_INVOCATION = "Incantation-Invocation",
    INVALID_INCANTATION    = "Invalid-Incantation",
  }

  
  /** A Desmos expression to add to the calculator. */
  export interface Expression
  {
    kind: Kind.EXPRESSION
    data: Desmos.ExpressionState
    incantations: Array<
      | IncantationInvocation<Incantation.Effect.LOCAL>
      | InvalidIncantation
      >
  }


  /** A pending incantation invocation that requires applying its argument (if any), then applying its effect. */
  export type IncantationInvocation<Effect extends Incantation.Effect = Incantation.Effect> =
    | {
      kind: Kind.INCANTATION_INVOCATION
      incantation: Incantation<Effect>
    }
    | {
      kind: Kind.INCANTATION_INVOCATION
      incantation: ArgIncantation<Effect>
      arg_raw: string | undefined
    };

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
export type Ast =
  | Ast.Expression
  | Ast.IncantationInvocation
  | Ast.InvalidIncantation
;
