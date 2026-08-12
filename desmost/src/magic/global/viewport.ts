import { Incantation, ArgIncantation, type GLOBAL } from "../incantation";


interface ViewportBounds
{
  left:   number; right: number;
  bottom: number; top:   number;
}


export class ViewportIncantation extends ArgIncantation<GLOBAL>
{
  override readonly identifier   = "viewport"
  override readonly requires_arg = true
  override readonly arg_type     = Incantation.ArgType.OBJECT

  apply(target: Desmos.Calculator, data: ViewportBounds)
  {
    // TODO validate bounds
    target.setMathBounds(data);
  }
}
