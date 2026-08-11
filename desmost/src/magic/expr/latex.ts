import { Incantation, ArgIncantation, type EXPR } from "../incantation";


export class LatexIncantation
  extends ArgIncantation<EXPR>
{
  override readonly identifier   = "latex"
  override readonly requires_arg = true
  override readonly arg_type     = Incantation.ArgType.LATEX

  apply(target: Desmos.ExpressionState, data: string): void
  {
    target.type = "expression";
    // @ts-expect-error: outdated types
    target.latex = data;
  }

  override evaluate_arg(data: string): string
  {
    return data;
  }
}
