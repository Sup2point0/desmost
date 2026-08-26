import { Incantation, ArgIncantation, type LOCAL } from "../incantation";

import { DesmosColour } from "../../desmos";
import { UnrecoverableError } from "../../errors";
import type { DesmostOptions } from "../../compiler";


export class ColourIncantation extends ArgIncantation<LOCAL>
{
	override readonly description
		= "Change the colour of a rendered expression, such as a line, region, polygon, etc."

	override readonly identifier   = "color"
	override readonly alias        = "colour"
	override readonly requires_arg = true
	override readonly arg_type     = Incantation.ArgType.ENUM

	override apply(target: Desmos.ExpressionState, data: DesmosColour)
	{
		super.require_expr_type(target.type, "expression");
		target.color = data;
	}

	override evaluate_arg(data: string, options: DesmostOptions): DesmosColour
	{
		switch (data.trim().toUpperCase()) {
			case "RED":    return DesmosColour.RED;
			case "BLUE":   return DesmosColour.BLUE;
			case "GREEN":  return DesmosColour.GREEN;
			case "PURPLE": return DesmosColour.PURPLE;
			case "ORANGE": return DesmosColour.ORANGE;
			case "BLACK":  return DesmosColour.BLACK;
			default:
				throw new UnrecoverableError(
					`Invalid colour: \`${data}\``
				);
		}
	}
}
