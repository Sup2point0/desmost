import Json5 from "JSON5";

import { Incantation, ArgIncantation, GLOBAL } from "../incantation";


interface ViewportBounds
{
  left:   number; right: number;
  bottom: number; top:   number;
}


export class ViewportIncantation
  extends ArgIncantation<GLOBAL, ViewportBounds>
{
  override readonly identifier = "viewport"
  override readonly requires_arg = true
  override readonly arg_type = Incantation.ArgType.OBJECT

  evaluate_arg(data: string): ViewportBounds
  {
    return Json5.parse(`{${data}}`);
  }

  apply(target: Desmos.Calculator, data: ViewportBounds)
  {
    target.setMathBounds(data);
  }
}
