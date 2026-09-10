import { Incantation, ArgIncantation, type GLOBAL } from "../incantation";

import { DesmostError, type Fallible } from "../../errors";
import type { DesmostOptions } from "../../options";
import { Ast } from "../../parser";


interface ViewportBounds
{
	left?:   number; right?: number;
	bottom?: number; top?:   number;
}

const VALID_KEYS = ["left", "right", "bottom", "top"];


export class ViewportIncantation extends ArgIncantation<GLOBAL>
{	
	override readonly effect       = Incantation.Effect.GLOBAL
	override readonly identifier   = "viewport"
	override readonly requires_arg = true
	override readonly arg_type     = Incantation.ArgType.OBJECT
	override readonly description
		= "Set the bounds of the viewport via `Calculator.setMathBounds()`."

	override apply(target: Desmos.Calculator, data: ViewportBounds)
	{
		let existing = target.graphpaperBounds.mathCoordinates;

		let {
			left   = existing.left,
			right  = existing.right,
			bottom = existing.bottom,
			top    = existing.top,
		} = data;

		target.setMathBounds({ left, right, bottom, top });
	}

	override evaluate_arg(raw: string, options: DesmostOptions): Fallible<ViewportBounds>
	{
		let out = super.evaluate_arg(raw, options) as ViewportBounds;

		if (options.check_args) {
			if (Object.keys(out).length === 0) {
				throw new DesmostError.InvalidArgument({
					msg:  `/${this.identifier} received empty viewport bounds`,
					hint: `Provide bounds like \`/viewport{left: -8, right: 8}\``,
					note: `Missing bounds are kept as their defaults`,
				});
			}

			let invalid_keys = Object.keys(out).filter(key => !VALID_KEYS.includes(key));

			if (invalid_keys.length > 0) {
				let plural = invalid_keys.length > 1 ? "fields" : "field";

				throw new DesmostError.InvalidArgument({
					msg:  `/${this.identifier} received invalid ${plural}: [${invalid_keys.join(", ")}]`,
					hint: `Valid fields are: [${VALID_KEYS.join(", ")}]`,
				});
			}
		}

		return out;
	}

	override extract(
		target: Desmos.Calculator,
		blank: Desmos.Calculator,
	): Ast.IncantationInvocation<Incantation.Effect.GLOBAL> | void
	{
		let { left, right, bottom, top } = target.graphpaperBounds.mathCoordinates;
		let bounds = { left, right, bottom, top };
		
		let defaults = blank.graphpaperBounds.mathCoordinates;

		for (let [key, val] of Object.entries(bounds)) {
			if (Math.abs(val - defaults[key]) < 0.001) {
				delete bounds[key];
			}
		}

		let arg_raw = super.emit_object_arg(bounds);
		if (arg_raw.trim() === "") return;

		return {
			kind: Ast.Kind.INCANTATION_INVOCATION,
			incantation: viewport,
			arg_raw,
		};
	}
}

export const viewport = new ViewportIncantation();
