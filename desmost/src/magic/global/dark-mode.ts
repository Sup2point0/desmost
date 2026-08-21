import { Incantation, type GLOBAL } from "../incantation";


export class DarkModeIncantation extends Incantation<GLOBAL>
{
	override readonly description
		= "Enable dark mode for the calculator, which inverts all colours."
	
	override readonly identifier = "dark"

	apply(target: Desmos.Calculator)
	{
		target.updateSettings({
			invertedColors: true,
		});
	}
}
