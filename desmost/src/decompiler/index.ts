/**
 * Implements the Desmos -> Desmost decompiler.
 * 
 * This decompiles a `Desmos.Calculator` instance into the *minimal* raw Desmost source code that could *completely* reproduce the calculator state. Decompilation happens through several lowering stages:
 * 
 * ```
 * Desmos.Calculator -> object[] -> Ast[] -> string
 * ```
 *
 * Technically it'd be more performant to directly emit 
 * 
 * The first 2 stages are closely intertwined, so they're merged into one `desmos_to_ast()` function.
 * 
 * 
 * ## Extracting the AST
 * 
 * We need to not only extract the expressions in the editor with `.getExpressions()`, but also other global calculator state like `.graphpaperBounds`.
 * 
 * We then transform those raw objects into `Ast` nodes.
 * 
 * The main challenge here is removing unnecessary noise - we need to pick up on fields that *wouldn't* be covered by defaults and include them as incantations, but ignore everything else to avoid producing humongous `/desmos{ p, q, r, s, t }` slop.
 * 
 * 
 * ## Emitting the Source
 * 
 * 
 */

export { decompile } from "./decompile";
