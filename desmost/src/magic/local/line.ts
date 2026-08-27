import { Incantation, ArgIncantation, type LOCAL } from "../incantation";

import type { DesmostOptions } from "../../options";
import { type Unrecoverable } from "../../errors";


interface LineOptions
{
	style?:   keyof typeof Desmos.Styles;
	width?:   number;
	opacity?: number;
}

const VALID_FIELDS = ["style", "width", "opacity"];


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
		
		if (data.style   != undefined) target.lineStyle   = data.style;
		if (data.width   != undefined) target.lineWidth   = data.width;
		if (data.opacity != undefined) target.lineOpacity = data.opacity;
	}

	override evaluate_arg(raw: string, options: DesmostOptions): Unrecoverable<LineOptions>
	{
		let out = super.evaluate_arg(raw, options) as LineOptions;

		if (options.check_args) {
			super.require_nonempty(out);
			super.require_known(out, VALID_FIELDS);
		}

		return out;
	}
}
