import { Incantation, ArgIncantation, type GLOBAL } from "../incantation";


interface ViewportBounds
{
	left?:   number; right?: number;
	bottom?: number; top?:   number;
}


export class ViewportIncantation extends ArgIncantation<GLOBAL>
{
	override readonly description
		= "Set the bounds of the viewport via `Calculator.setMathBounds()`."
	
	override readonly identifier   = "viewport"
	override readonly requires_arg = true
	override readonly arg_type     = Incantation.ArgType.OBJECT

	apply(target: Desmos.Calculator, data: ViewportBounds)
	{
		let existing = target.graphpaperBounds.mathCoordinates;
		console.log(`existing =`, existing);

		let {
			left   = existing.left,
			right  = existing.right,
			bottom = existing.bottom,
			top    = existing.top,
		} = data;

		target.setMathBounds({ left, right, bottom, top });
	}
}
