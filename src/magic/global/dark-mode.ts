import { Incantation, GLOBAL } from "../incantation";


export class DarkModeIncantation extends Incantation<GLOBAL>
{
  override readonly identifier = "dark"

  apply(target: Desmos.Calculator)
  {
    target.updateSettings({
      invertedColors: true,
    });
  }
}
