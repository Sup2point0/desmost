import { Incantation, type LOCAL } from "../incantation";

import { Ast } from "../../parser";


export class HideIncantation extends Incantation<LOCAL>
{
	override readonly effect       = Incantation.Effect.LOCAL
	override readonly identifier = "hide"
	override readonly description
		= "Hide rendering for a block. This includes graphs, points, polygons, etc."

	apply(target: Desmos.ExpressionState)
	{
		super.require_expr_type(target.type, "expression");
		target.hidden = true;
	}
		
	override extract(target: Desmos.Expression): Ast.IncantationInvocation<LOCAL> | void
	{
		if (target.hidden) {
			return {
				kind: Ast.Kind.INCANTATION_INVOCATION,
				incantation: hide,
			};
		}
	}
}

export const hide = new HideIncantation();
