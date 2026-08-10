import { Incantation, ArgIncantation, type EXPR } from "../incantation";


export class TextIncantation
  extends ArgIncantation<EXPR, string>
{
  override readonly identifier   = "text"
  override readonly requires_arg = true
  override readonly arg_type     = Incantation.ArgType.STRING

  override apply(target: Desmos.ExpressionState, data: string)
  {
    target.type = "text";
    // @ts-expect-error: outdated types
    target.text = data;
  }
}
