/** The parser failed to parse something (usually during speculative parsing), which only results in internal backtracking. */
export const NO_MATCH = Symbol("no-match");

/** The compiler encountered a non-fatal recoverable failure (usually during speculative parsing), which only results in internal backtracking. */
export type NoMatch = typeof NO_MATCH & { readonly __brand?: unique symbol };


export const INVALID_PARSE = Symbol("invalid-parse");

export type InvalidParse = typeof INVALID_PARSE & { readonly __brand?: unique symbol };
