import { Incantation, ArgIncantation, type LOCAL } from "../incantation";

import { DesmostError } from "../../errors";
import type { DesmostOptions } from "../../options";


interface LabelOptions
{
	text: string;
	show?: boolean;
	size?: number;
	pos?: "ABOVE" | "BELOW" | "LEFT" | "RIGHT" | "ABOVE_LEFT" | "ABOVE_RIGHT" | "BELOW_LEFT" | "BELOW_RIGHT";
}

const VALID_FIELDS = ["text", "show", "size", "pos"];

const VALID_POSITIONS = [
	"ABOVE", "BELOW", "LEFT", "RIGHT",
	"ABOVE_LEFT", "ABOVE_RIGHT", "BELOW_LEFT", "BELOW_RIGHT",
];


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
		// @ts-expect-error: outdated types
		if (data.pos  != undefined) target.labelOrientation = data.pos;
	}

	override evaluate_arg(raw: string, options: DesmostOptions): LabelOptions
	{
		let out = super.evaluate_arg(raw, options) as LabelOptions;

		if (options.check_args) {
			super.require_nonempty(out, `/label received empty argument`, {
				hint: `You can provide [${VALID_FIELDS.join(", ")}]`,
				flagged_by: "check_args",
			});

			if (!("text" in out)) {
				throw new DesmostError.MissingInput(
					`/label is missing label text`,
					{
						hint: `Provide text for the label: \`/label{text: "sup world!"}\``,
						flagged_by: "check_args",
					}
				);
			}

			super.require_known(out, VALID_FIELDS);
		}

		if (typeof out.pos != "undefined") {
			let pos = out.pos.trim().toUpperCase().replaceAll("-", "_");

			if (VALID_POSITIONS.includes(pos)) {
				// @ts-expect-error: validated
				out.pos = pos;
			}
			else {
				// @ts-expect-error: indexing
				let orientation = Desmos.LabelOrientations[pos];

				if (options.check_args && orientation == undefined) {
					throw new DesmostError.InvalidArgument(
						`/label received invalid label position: ${pos}`,
						{
							hint: `Valid label positions are ${VALID_POSITIONS.join(", ")}`,
							flagged_by: "check_args"
						}
					);
				}
				
				out.pos = orientation;
			}
		}

		return out;
	}
}
