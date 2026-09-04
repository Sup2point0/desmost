import { Incantation, type LOCAL } from "../incantation";
import { Ast } from "../../parser";


export class AnimIncantation extends Incantation<LOCAL>
{
	override readonly description
		= `Animate the slider of a block.`
	
	override readonly identifier = "anim"

	override apply(target: Desmos.ExpressionState)
	{
		super.require_expr_type(target.type, "expression");
		target.playing = true;
	}

	override extract(target: Desmos.Expression): Ast.IncantationInvocation<LOCAL> | void
	{
		if (target.playing) {
			return {
				kind: Ast.Kind.INCANTATION_INVOCATION,
				incantation: anim,
			};
		}
	}
}

export const anim = new AnimIncantation();
