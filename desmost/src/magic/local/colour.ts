import { Incantation, ArgIncantation, type LOCAL } from "../incantation";

import type { DesmostOptions } from "../../options";
import { DesmostError } from "../../errors";
import { Ast } from "../../parser";


type DesmosColourName = keyof typeof Desmos.Colors;
type DesmosColour = (typeof Desmos.Colors)[DesmosColourName];

const VALID_COLOURS = ["RED", "BLUE", "GREEN", "PURPLE", "ORANGE", "BLACK"];


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
		let colour = data.trim().toUpperCase();

		if (VALID_COLOURS.includes(colour)) {
			return Desmos.Colors[colour as DesmosColourName];
		}
		else {
			let internal = Desmos.Colors[colour as DesmosColourName];

			if (options.check_args && internal == undefined) {
				throw new DesmostError.InvalidArgument({
					msg:  `/colour received invalid colour: \`${data}\``,
					hint: `Valid colours are ${VALID_COLOURS.join(", ")}`,
				});
			}

			return internal;
		}
	}
	
	override extract(target: Desmos.Expression): Ast.IncantationInvocation<LOCAL>
	{
		return {
			kind: Ast.Kind.INCANTATION_INVOCATION,
			incantation: colour,
			arg_raw: target.color,  // FIXME use name
		};
	}
}

export const colour = new ColourIncantation();
