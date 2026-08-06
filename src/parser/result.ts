import { Incantation } from "../magic";


export namespace ParseResult
{
  /** What kind of parse result this is. */
  export enum Kind
  {
    DONE,
    GLOBAL_EFFECT,
    EXPRESSION,
  }

  /** The parser successfully reached the end of its source. */
  export interface Done { kind: Kind.DONE }

  /** Sentinel value to signal the parser successfully reached the end of its source. */
  export const DONE: Done = { kind: Kind.DONE };

  /** A global incantation effect to apply to the whole calculator. */
  export interface GlobalEffect
  {
    kind: Kind.GLOBAL_EFFECT
    data: Incantation
  }

  /** A Desmos expression to add to the calculator. */
  export interface Expression
  {
    kind: Kind.EXPRESSION
    data: Desmos.ExpressionState
  }
}

/** The result of parsing a block of source code. */
export type ParseResult =
  | ParseResult.Done
  | ParseResult.GlobalEffect
  | ParseResult.Expression
;


/** The parser encountered a recoverable failure. */
export class UnrecoverableFail extends Error {}

/** The parser encountered an unrecoverable failure. */
export class RecoverableFail extends Error {}


/** Indicates that a function may throw a `RecoverableFail`. */
export type Recoverable<Result> = Result;

/** Indicates that a function may throw a `UnrecoverableFail`. */
export type Unrecoverable<Result> = Result;
