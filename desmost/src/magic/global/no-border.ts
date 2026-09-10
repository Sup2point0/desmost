import { Incantation, type GLOBAL } from "../incantation";

import { Ast } from "../../parser";


export class NoBorderIncantation extends Incantation<GLOBAL>
{
	override readonly effect       = Incantation.Effect.GLOBAL
	override readonly identifier   = "no-border"
	override readonly description
   	= "Remove the “subtle 1px gray border around the entire calculator”."

	override apply(target: Desmos.Calculator)
	{
		target.updateSettings({ border: false });
	}

	override extract(target: Desmos.Calculator): Ast.IncantationInvocation<GLOBAL> | void
	{
		if (target.settings.border === false) {
			return {
				kind: Ast.Kind.INCANTATION_INVOCATION,
				incantation: no_border,
			};
		}
	}
}

export const no_border = new NoBorderIncantation();
