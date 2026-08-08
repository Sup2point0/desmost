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


  /** The parser encountered errors while trying to parse an incantation. */
  export class InvalidIncantation extends UnrecoverableError
  {
    /**
     * Can the error be contained by skipping application of this incantation?
     * 
     * For instance, for an invalid `/slider{ bogus } :: t = 0`, we can skip trying to apply `/slider` and keep `t = 0`. But for `/latex{ what }`, without `/latex` we can't produce an expression, so we can't skip.
    */
    skip_and_surface: boolean;

    constructor(message?: string, options?: { skip_and_surface: boolean })
    {
      super(message);
      this.skip_and_surface = options?.skip_and_surface ?? false;
    }
  }
}


/** The parser encountered a non-fatal recoverable failure (usually during speculative parsing), which only results in internal backtracking. */
export class RecoverableFail {}


/** Indicates that a function may throw a `RecoverableFail`. */
export type Recoverable<Result> = Result | Result & { readonly __brand?: unique symbol };

/** Indicates that a function may throw an `UnrecoverableError`. */
export type Unrecoverable<Result> = Result | Result & { readonly __brand?: unique symbol };;

/**
 * Indicates that a function may throw either a `RecoverableFail` *or* an `UnrecoverableError`.
 * 
 * This is used in potentially ambiguous cases. For instance, the user might have invoked an unknown incantation, in which case we might want to `RecoverableFail` and fallback to parsing it as LaTeX; on the other hand, if they invoked a valid incantation, but did not supply the required argument, that's a definite `UnrecoverableError`.
 */
export type MaybeRecoverable<Result> = Recoverable<Result> | Unrecoverable<Result>;
