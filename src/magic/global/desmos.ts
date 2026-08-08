import { Incantation, ArgIncantation, GLOBAL } from "../incantation";


export class DesmosIncantation
  extends ArgIncantation<GLOBAL, Desmos.GraphConfiguration & Desmos.GraphSettings>
{
  override readonly identifier   = "desmos"
  override readonly requires_arg = false
  override readonly arg_type     = Incantation.ArgType.OBJECT

  override apply(target: Desmos.Calculator, data: Desmos.GraphConfiguration & Desmos.GraphSettings): void
  {
    target.updateSettings(data);
  }
}
