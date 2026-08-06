import { Incantation, GLOBAL } from "../incantation";


interface ViewportBounds
{
  left:   number; right: number;
  bottom: number; top:   number;
}


export class ViewportIncantation extends Incantation<GLOBAL, ViewportBounds>
{
  readonly identifier = "viewport"
  readonly expect_data = Incantation.ExpectData.REQUIRED

  parse_data(data: string): ViewportBounds
  {
    // FIXME
    return JSON.parse(data);
  }

  apply(target: Desmos.Calculator, data: ViewportBounds)
  {
    target.setMathBounds(data);
  }
}
