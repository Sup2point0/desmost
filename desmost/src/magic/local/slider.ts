import { Incantation, ArgIncantation, type LOCAL } from "../incantation";


interface SliderBounds
{
  min?:  number | string;
  max?:  number | string;
  step?: number | string;
}


export class SliderIncantation
  extends ArgIncantation<LOCAL, SliderBounds>
{
  override readonly identifier   = "slider"
  override readonly requires_arg = true
  override readonly arg_type     = Incantation.ArgType.OBJECT

  override apply(target: Desmos.ExpressionState, data: SliderBounds)
  {
    // @ts-expect-error: outdated types
    target.sliderBounds = data;
  }
}
