/** The parser encountered a recoverable failure, which only results in backtracking internally. */
export class UnrecoverableError extends Error {}

/** The parser encountered an unrecoverable error, which will reach the end user. */
export namespace UnrecoverableError
{
  /** The parser unexpectedly reached the end of its input source code. */
  export class UnexpectedEnd extends UnrecoverableError {}
}


/** The parser encountered an unrecoverable failure. */
export class RecoverableFail extends Error {}


/** Indicates that a function may throw a `RecoverableFail`. */
export type Recoverable<Result> = Result;

/** Indicates that a function may throw a `UnrecoverableFail`. */
export type Unrecoverable<Result> = Result;

/** Indicates that a function may throw either a `RecoverableFail` or `UnrecoverableFail`. */
export type 
