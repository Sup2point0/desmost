import { Incantation, type LOCAL } from "../incantation";

import { Ast } from "../../parser";


export class NoFillIncantation extends Incantation<LOCAL>
{
	override readonly effect     = Incantation.Effect.LOCAL
	override readonly identifier = "no-fill"
	override readonly description
		= "Disable rendering fill for a block."

	override apply(target: Desmos.ExpressionState)
	{
		super.require_expr_type(target.type, "expression");
		target.fill = false;
	}
		
	override extract(target: Desmos.Expression): Ast.IncantationInvocation<LOCAL> | void
	{
		if (target.fill === false) {
			return {
				kind: Ast.Kind.INCANTATION_INVOCATION,
				incantation: no_fill,
			};
		}
	}
}

export const no_fill = new NoFillIncantation();
