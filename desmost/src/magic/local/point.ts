import { Incantation, ArgIncantation, type LOCAL } from "../incantation";

import { Ast } from "../../parser";


interface PointStyles
{
	style?:   keyof typeof Desmos.Styles;
	size?:    number;
	opacity?: number;
}


export class PointIncantation extends ArgIncantation<LOCAL>
{
	override readonly description
		= ""
	
	override readonly identifier   = "point"
	override readonly requires_arg = true
	override readonly arg_type     = Incantation.ArgType.OBJECT

	override apply(target: Desmos.ExpressionState, data: Partial<PointStyles>)
	{
		super.require_expr_type(target.type, "expression");

		if (data.style   != undefined)  target.pointStyle   = data.style;
		if (data.size    != undefined)  target.pointSize    = data.size;
		if (data.opacity != undefined)  target.pointOpacity = data.opacity;
	}

	override extract(target: Desmos.Expression): Ast.IncantationInvocation<LOCAL> | void
	{
		if (
				target.pointStyle   != undefined
			|| target.pointSize    != undefined
			|| target.pointOpacity != undefined
		)
		{
			return {
				kind: Ast.Kind.INCANTATION_INVOCATION,
				incantation: point,
				arg_raw: super.emit_object_arg({
					style:   target.pointStyle,
					size:    target.pointSize,
					opacity: target.pointOpacity,
				}),
			};
		}
	}
}

export const point = new PointIncantation();
