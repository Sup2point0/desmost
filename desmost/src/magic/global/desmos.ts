import { Incantation, ArgIncantation, type GLOBAL } from "../incantation";


type DesmosSettings = Desmos.GraphConfiguration & Desmos.GraphSettings


export class DesmosIncantation extends ArgIncantation<GLOBAL>
{
	override readonly description
		= "Set the configuration of the calculator via `Calculator.updateSettings()`."
	
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
}
