import { Incantation, type LOCAL } from "../incantation";

import { Ast } from "../../parser";


export class DottedIncantation extends Incantation<LOCAL>
{
	override readonly effect       = Incantation.Effect.LOCAL
	override readonly identifier = "dotted"
	override readonly description
		= "Render a block as a dotted line."

	override apply(target: Desmos.ExpressionState)
	{
		super.require_expr_type(target.type, "expression");
		target.lineStyle = Desmos.Styles.DOTTED;
	}
	
	override extract(target: Desmos.Expression): Ast.IncantationInvocation<LOCAL> | void
	{
		if (target.lineStyle === Desmos.Styles.DOTTED) {
			return {
				kind: Ast.Kind.INCANTATION_INVOCATION,
				incantation: dotted,
			};
		}
	}
}

export const dotted = new DottedIncantation();
