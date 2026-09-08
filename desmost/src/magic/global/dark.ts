import { Incantation, type GLOBAL } from "../incantation";

import { Ast } from "../../parser";


export class DarkModeIncantation extends Incantation<GLOBAL>
{
	override readonly effect     = Incantation.Effect.GLOBAL
	override readonly identifier = "dark"
	override readonly description
		= "Enable dark mode for the calculator, which inverts all colours."

	apply(target: Desmos.Calculator)
	{
		target.updateSettings({ invertedColors: true });
	}

	override extract(target: Desmos.Calculator): Ast.IncantationInvocation<Incantation.Effect.GLOBAL> | void
	{
		if (target.settings.invertedColors) {
			return {
				kind: Ast.Kind.INCANTATION_INVOCATION,
				incantation: dark,
			};
		}
	}
}

export const dark = new DarkModeIncantation();
