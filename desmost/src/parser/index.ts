/**
 * Implements `DesmostParser`, the Desmost parsing engine.
 * 
 * The parsing engine makes heavy use of exceptions for backtracking, which is *very unperformant*, but makes for *much more readable code*. Desmost isn't expecting to parse huge documents of source code, so I decided this is an acceptable trade-off.
 */

export { DesmostParser } from "./desmost-parser";
export { Ast as ParseResult } from "./result";
