import { Incantation, ArgIncantation, type LOCAL } from "../incantation";

import { Ast } from "../../parser";


interface SliderBounds
{
	min:   number | string;
	max:   number | string;
	step?: number | string;
}


export class SliderIncantation extends ArgIncantation<LOCAL>
{
	override readonly description
		= "Set the bounds of the slider for a variable."
	
	override readonly identifier   = "slider"
	override readonly requires_arg = true
	override readonly arg_type     = Incantation.ArgType.OBJECT

	override apply(target: Desmos.ExpressionState, data: SliderBounds)
	{
		super.require_expr_type(target.type, "expression");
		target.sliderBounds = data;
	}
		
	override extract(target: Desmos.Expression): Ast.IncantationInvocation<LOCAL> | void
	{
		if (target.sliderBounds != undefined) {
			return {
				kind: Ast.Kind.INCANTATION_INVOCATION,
				incantation: slider,
				arg_raw: super.emit_arg(target.sliderBounds),
			};
		}
	}
}

export const slider = new SliderIncantation();
