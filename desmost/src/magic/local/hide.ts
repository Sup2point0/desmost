import { Incantation, type LOCAL } from "../incantation";


export class HideIncantation extends Incantation<LOCAL>
{
	override readonly description
		= "Hide rendering for a block. This includes graphs, points, polygons, etc."
	
	override readonly identifier = "hide"

	apply(target: Desmos.ExpressionState)
	{
		super.require_expr_type(target.type, "expression");
		target.hidden = true;
	}
}
