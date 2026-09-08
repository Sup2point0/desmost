import { Incantation, type LOCAL } from "../incantation";

import { Ast } from "../../parser";


export class NoLineIncantation extends Incantation<LOCAL>
{
	override readonly effect       = Incantation.Effect.LOCAL
	override readonly identifier = "no-line"
	override readonly description
		= "Disable rendering lines for a block."

	override apply(target: Desmos.ExpressionState)
	{
		super.require_expr_type(target.type, "expression");
		target.lines = false;
	}
		
	override extract(target: Desmos.Expression): Ast.IncantationInvocation<LOCAL> | void
	{
		if (target.lines === false) {
			return {
				kind: Ast.Kind.INCANTATION_INVOCATION,
				incantation: no_line,
			};
		}
	}
}

export const no_line = new NoLineIncantation();
