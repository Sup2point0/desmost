import { Incantation, ArgIncantation, type LOCAL } from "../incantation";

import type { DesmostOptions } from "../../options";
import { DesmostError } from "../../errors";
import { Ast } from "../../parser";


type DesmosColourName = keyof typeof Desmos.Colors;
type DesmosColour = (typeof Desmos.Colors)[DesmosColourName];
type HexColour = string;

const VALID_COLOURS = ["RED", "BLUE", "GREEN", "PURPLE", "ORANGE", "BLACK"];


export class ColourIncantation extends ArgIncantation<LOCAL>
{
	override readonly effect       = Incantation.Effect.LOCAL
	override readonly identifier   = "colour"
	override readonly alias        = "color"
	override readonly requires_arg = true
	override readonly arg_type     = Incantation.ArgType.STRING
	override readonly description
		= "Change the colour of a rendered expression, such as a line, region, polygon, etc."

	override apply(target: Desmos.ExpressionState, data: DesmosColour | HexColour)
	{
		super.require_expr_type(target.type, "expression");
		target.color = data;
	}

	override evaluate_arg(data: string, options: DesmostOptions): DesmosColour | HexColour
	{
		let colour = data.trim().toUpperCase();

		if (VALID_COLOURS.includes(colour)) {
			return Desmos.Colors[colour as DesmosColourName];
		}
		else {
			let internal = Desmos.Colors[colour as DesmosColourName];
			if (internal != undefined) return internal;

			if (options.check_args && !colour.startsWith("#")) {
				throw new DesmostError.InvalidArgument({
					msg:  `/colour received invalid colour: \`${data}\``,
					hint: `Valid colours are ${VALID_COLOURS.join(", ")}`,
				});
			}

			return colour;
		}
	}
	
	override extract(target: Desmos.Expression): Ast.IncantationInvocation<LOCAL> | void
	{
		if (target.color == undefined) return;

		let hex = target.color.toLowerCase();

		return {
			kind: Ast.Kind.INCANTATION_INVOCATION,
			incantation: colour,
			arg_raw:
				Object.entries(Desmos.Colors).find(([k, v]) => v === hex)?.[0]
				?? target.color,
		};
	}
}

export const colour = new ColourIncantation();
