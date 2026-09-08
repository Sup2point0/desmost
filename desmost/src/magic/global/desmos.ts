import { Incantation, ArgIncantation, type GLOBAL } from "../incantation";

import type { DesmostOptions } from "../../options";
import { DesmostError, type Fallible } from "../../errors";
import { Ast } from "../../parser";


type DesmosSettings = Desmos.GraphConfiguration & Desmos.GraphSettings


export class DesmosIncantation extends ArgIncantation<GLOBAL>
{
	override readonly description
		= "Tweak calculator settings via `Calculator.updateSettings()`."
	
	override readonly identifier   = "desmos"
	override readonly requires_arg = false
	override readonly arg_type     = Incantation.ArgType.OBJECT

	override apply(
		target: Desmos.Calculator,
		data?: DesmosSettings,
	): void
	{
		if (data != undefined) {
			target.updateSettings(data);
		}
	}

	override evaluate_arg(raw: string, options: DesmostOptions): Fallible<DesmosSettings>
	{
		let out = super.evaluate_arg(raw, options) as DesmosSettings;

		if (options.check_args) {
			if (Object.keys(out).length === 0) {
				throw new DesmostError.MissingInput({
					msg:  `/desmos received empty settings`,
					hint: `Provide settings like \`/desmos{expressionsCollapsed: true}\``,
					note: `Use just /desmos (without \`{}\`) if you want it as an indicator`,
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
		let settings = { ...target.settings };
		let defaults = blank.settings;

		for (let [key, val] of Object.entries(settings)) {
			if (
					val === defaults[key]
				|| key === "__observers"
				|| key === "guid"
				|| key === "randomSeed"
				|| key === "colors"
			) {
				delete settings[key];
			}
		}

		let arg_raw = super.emit_object_arg(settings);
		if (arg_raw.trim() === "") return;

		return {
			kind: Ast.Kind.INCANTATION_INVOCATION,
			incantation: desmos,
			arg_raw,
		};
	}
}

export const desmos = new DesmosIncantation();
