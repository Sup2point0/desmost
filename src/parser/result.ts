export namespace ParseResult
{
  export enum Kind
  {
    DONE,
    RECOVERABLE_FAIL,
    EXPRESSION,
  }

  /** The parser successfully reached the end of its source. */
  export interface Done { kind: Kind.DONE }

  /** Sentinel value to signal the parser successfully reached the end of its source. */
  export const DONE: Done = { kind: Kind.DONE };


  export interface Expression
  {
    kind: Kind.EXPRESSION;
    data: Desmos.ExpressionState;
  }
}

export type ParseResult =
  | ParseResult.Done
  | ParseResult.Expression
;


/** The parser encountered a recoverable failure. */
export class UnrecoverableFail extends Error {}

/** The parser encountered an unrecoverable failure. */
export class RecoverableFail extends Error {}
