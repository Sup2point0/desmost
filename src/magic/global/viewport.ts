import Json5 from "JSON5";

import { DataIncantation, GLOBAL } from "../incantation";


interface ViewportBounds
{
  left:   number; right: number;
  bottom: number; top:   number;
}


export class ViewportIncantation extends DataIncantation<GLOBAL, ViewportBounds>
{
  readonly identifier = "viewport"
  readonly requires_data = true

  parse_data(data: string): ViewportBounds
  {
    return Json5.parse(`{${data}}`);
  }

  apply(target: Desmos.Calculator, data: ViewportBounds)
  {
    target.setMathBounds(data);
  }
}
