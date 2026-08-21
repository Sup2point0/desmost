import { Incantation, ArgIncantation, type LOCAL } from "../incantation";


interface LineOptions
{
	style?:   keyof typeof Desmos.Styles;  // TODO allow raw enum
	width?:   number;
	opacity?: number;
}


export class LineIncantation extends ArgIncantation<LOCAL>
{
	override readonly description
		= "Change line styles for a rendered block."

	override readonly identifier   = "line"
	override readonly requires_arg = true
	override readonly arg_type     = Incantation.ArgType.OBJECT

	override apply(target: Desmos.ExpressionState, data: LineOptions)
	{
		super.require_expr_type(target.type, "expression");
		
		if (data.style != undefined)   target.lineStyle   = data.style;
		if (data.width != undefined)   target.lineWidth   = data.width;
		if (data.opacity != undefined) target.lineOpacity = data.opacity;
	}
}
