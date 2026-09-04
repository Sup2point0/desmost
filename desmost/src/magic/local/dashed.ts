import { Incantation, type LOCAL } from "../incantation";

import { Ast } from "../../parser";


export class DashedIncantation extends Incantation<LOCAL>
{
	override readonly description
		= "Render a block as a dashed line."
	
	override readonly identifier = "dashed"

	override apply(target: Desmos.ExpressionState)
	{
		super.require_expr_type(target.type, "expression");
		target.lineStyle = Desmos.Styles.DASHED;
	}
	
	override extract(target: Desmos.Expression): Ast.IncantationInvocation<LOCAL> | void
	{
		if (target.lineStyle === Desmos.Styles.DASHED) {
			return {
				kind: Ast.Kind.INCANTATION_INVOCATION,
				incantation: dashed,
			};
		}
	}
}

export const dashed = new DashedIncantation();
