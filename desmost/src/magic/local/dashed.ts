import { Incantation, type LOCAL } from "../incantation";


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
}
