import { Incantation, ArgIncantation, type LOCAL } from "../incantation";

import { Ast } from "../../parser";


interface FillOptions
{
	opacity: number;
}


export class FillIncantation extends ArgIncantation<LOCAL>
{
	override readonly description
		= "Change fill styles for a rendered block."
	
	override readonly identifier   = "fill"
	override readonly requires_arg = true
	override readonly arg_type     = Incantation.ArgType.OBJECT

	override apply(target: Desmos.ExpressionState, data: FillOptions)
	{
		super.require_expr_type(target.type, "expression");
		target.fillOpacity = data.opacity;
	}

	override extract(target: Desmos.Expression): Ast.IncantationInvocation<LOCAL> | void
	{
		// TODO
	}
}

export const fill = new FillIncantation();
