import { Incantation, ArgIncantation, LOCAL } from "../incantation";


interface FillOptions
{
  opacity: number;
}


export class FillIncantation
  extends ArgIncantation<LOCAL, FillOptions>
{
  override readonly identifier   = "fill"
  override readonly requires_arg = true
  override readonly arg_type     = Incantation.ArgType.OBJECT

  override apply(target: Desmos.ExpressionState, data: FillOptions)
  {
    // @ts-expect-error: outdated types
    target.fillOpacity = data.opacity;
  }
}
