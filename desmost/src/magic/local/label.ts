import { UnrecoverableError } from "../../errors";
import { Incantation, ArgIncantation, type LOCAL } from "../incantation";


interface LabelOptions
{
	text: string;
	show?: boolean;
	size?: number | keyof typeof Desmos.LabelSizes;
	pos?: keyof typeof Desmos.LabelOrientations;
}


export class LabelIncantation extends ArgIncantation<LOCAL>
{
	override readonly description
		= "Label a block that evaluates to a point(s)."

	override readonly identifier   = "label"
	override readonly requires_arg = true
	override readonly arg_type     = Incantation.ArgType.OBJECT

	override apply(target: Desmos.ExpressionState, data: LabelOptions)
	{
		super.require_expr_type(target.type, "expression");
		target.label = data.text;
		target.showLabel = data.show ?? true;
		// @ts-expect-error: outdated types
		if (data.size != undefined) target.labelSize = data.size;
		if (data.pos  != undefined) target.labelOrientation = data.pos;
	}

	override evaluate_arg(raw: string): LabelOptions
	{
		let out = super.evaluate_arg(raw) as LabelOptions;

		if (!("text" in out)) {
			throw new UnrecoverableError.InvalidArgument(
				`/label requires a \`text\` argument, such as: \`/label{ text: "sup world!" }\``
			);
		}

		if (typeof out.pos != "undefined") {
			let pos = out.pos.trim().toUpperCase();

			switch (pos) {
				case "ABOVE":
				case "BELOW":
				case "LEFT":
				case "RIGHT":
					out.pos = pos;
					break;
				
				default:
					throw new UnrecoverableError.InvalidArgument(
						`/label: Invalid label position: ${pos}`
					);
			}
		}

		return out;
	}
}
