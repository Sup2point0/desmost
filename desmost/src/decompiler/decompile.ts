import { emit_global_incantation, emit_expression } from "./emit";
import { extract_settings, extract_viewport, extract_expression } from "./extract";

import { Ast } from "../parser";


/**
 * Decompile Desmos into raw Desmost source code.
 */
export function decompile(desmos: Desmos.Calculator): string
{
	let { globals, locals } = desmos_to_ast(desmos);
	return ast_to_text([...globals, ...locals]);
}

/**
 * Decompile `desmos` into a semi-structured AST.
 */
export function desmos_to_ast(desmos: Desmos.Calculator): {
	globals: Ast.IncantationInvocation[];
	locals: Ast.Expression[];
}
{
	return {
		globals: [
			extract_settings(desmos),
			extract_viewport(desmos),
		],
		locals: desmos.getExpressions().map(extract_expression),
	};
}

/**
 * Emit the Desmost source code representation of `ast`.
 */
export function ast_to_source(ast: Ast[]): string
{
	return (
		ast.map(each => {
			switch (each.kind) {
				case Ast.Kind.INCANTATION_INVOCATION:
					return emit_global_incantation(each);
				
				case Ast.Kind.EXPRESSION:
					return emit_expression(each);

				default:
					return "";
			}
		})
		.join("\n")
	);
}
