import { emit_global_incantation, emit_expression } from "./emit";
import { extract_settings, extract_viewport, extract_expression } from "./extract";

import { Ast } from "../parser";
import type { DesmostOptions } from "../compiler";


export interface SemiStructuredAst
{
   globals: Ast.IncantationInvocation[];
	locals: Ast.Expression[];
}


/**
 * Decompile Desmos into raw Desmost source code.
 * 
 * The caller must also supply a `blank` calculator instance. This is used as a reference for default field values, so that emitted incantations like `/desmos{}` don't get filled with a huge amount of noise.
 */
export function decompile(
	/** The Desmos calculator instance to decompile. */
	desmos: Desmos.Calculator,

	/**
	 * The default blank Desmos calculator instance to use as a baseline.
	 * 
	 * It is **highly recommended** to include this, otherwise your decompiled source will have a bunch of unnecessary incantations!
	 * 
	 * This is used in deciding what settings are noise that can be omitted. For instance, most of your calculator settings are probably set to their default values, so there's no need to include *every single one of them* in `/desmos{}`.
	 */
	blank?: Desmos.Calculator,

	// TODO doc
	options?: Partial<DesmostOptions>,
): string
{
	return ast_to_source(desmos_to_ast(desmos, blank ?? desmos));
}

/**
 * Decompile `desmos` into a semi-structured AST.
 */
export function desmos_to_ast(desmos: Desmos.Calculator, blank: Desmos.Calculator): SemiStructuredAst
{
	return {
		globals: [
			extract_settings(desmos, blank),
			extract_viewport(desmos, blank),
		].filter(x => x != null),
		locals: desmos.getExpressions().map(extract_expression),
	};
}

/**
 * Emit the Desmost source code representation of `ast`.
 */
export function ast_to_source(ast: SemiStructuredAst): string
{
	return (
      ast.globals.map(emit_global_incantation).join("\n")
      + "\n\n"
      + ast.locals.map(emit_expression).join("\n")
	);
}
