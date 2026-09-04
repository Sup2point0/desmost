import { Incantation, ArgIncantation, type LOCAL } from "../incantation";

import type { DesmostOptions } from "../../options";
import { DesmostError } from "../../errors";
import { Ast } from "../../parser";


interface LabelOptions
{
	text:  string
	show?: boolean
	size?: number
	pos?:
		| "default"
		| "above" | "below" | "left" | "right"
		| "above_left" | "above_right" | "below_left" | "below_right"
}

const VALID_FIELDS = ["text", "show", "size", "pos"];

const VALID_POSITIONS = [
	"default",
	"above", "below", "left", "right",
	"above_left", "above_right", "below_left", "below_right",
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
			super.require_nonempty(out, {
				msg:  `/label received empty argument`,
				hint: `You can provide [${VALID_FIELDS.join(", ")}]`,
			});

			if (!("text" in out)) {
				throw new DesmostError.MissingInput({
					msg:  `/label is missing label text`,
					hint: `Provide text for the label: \`/label{text: "sup world!"}\``,
				});
			}

			super.require_known(out, VALID_FIELDS);
		}

		if (typeof out.pos != "undefined") {
			let pos = out.pos.trim().toLowerCase().replaceAll("-", "_");

			if (VALID_POSITIONS.includes(pos)) {
				// @ts-expect-error: validated
				out.pos = pos;
			}
			else {
				// @ts-expect-error: indexing
				let orientation = Desmos.LabelOrientations[pos];

				if (options.check_args && orientation == undefined) {
					throw new DesmostError.InvalidArgument({
						msg:  `/label received invalid label position: ${pos}`,
						hint: `Valid label positions are ${VALID_POSITIONS.join(", ")}`,
					});
				}
				
				out.pos = orientation;
			}
		}

		return out;
	}
		
	override extract(target: Desmos.Expression): Ast.IncantationInvocation<LOCAL> | void
	{
		if (target.label) {
			return {
				kind: Ast.Kind.INCANTATION_INVOCATION,
				incantation: label,
				// TODO filter defined?
				arg_raw: JSON.stringify({
					text: target.label,
					show: target.showLabel,
					size: target.labelSize,
					pos:  target.labelOrientation,
				}),
			};
		}
	}
}

export const label = new LabelIncantation();
