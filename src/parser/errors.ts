/** The parser encountered a fatal unrecoverable error, which will reach the end user. */
export class UnrecoverableError extends Error {}

/** The parser encountered a fatal unrecoverable error, which will reach the end user. */
export namespace UnrecoverableError
{
  /** The parser unexpectedly reached the end of its entire input source code. */
  export class UnexpectedEnd extends UnrecoverableError {}

  /** The parser did not receive input that it expected. */
  export class MissingInput extends UnrecoverableError {}

  /** The parser received input that did not match what it expected. */
  export class UnexpectedInput extends UnrecoverableError {}

  /** The parser received excess input that it did not expect. */
  export class ExcessInput extends UnrecoverableError {}
}


/** The parser encountered a non-fatal recoverable failure (usually during speculative parsing), which only results in internal backtracking. */
export class RecoverableFail {}


/** Indicates that a function may throw a `RecoverableFail`. */
export type Recoverable<Result> = Result;

/** Indicates that a function may throw a `UnrecoverableError`. */
export type Unrecoverable<Result> = Result;
