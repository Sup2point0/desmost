import { Incantation, ArgIncantation, EXPR } from "../incantation";


export class LatexIncantation
  extends ArgIncantation<EXPR, string>
{
  override readonly identifier   = "?"
  override readonly requires_arg = true
  override readonly arg_type     = Incantation.ArgType.LATEX

  apply(target: Desmos.ExpressionState, data: string): void
  {
    // @ts-expect-error: outdated types
    target.latex = data;
  }

  override evaluate_arg(data: string): string
  {
    return data;
  }
}
