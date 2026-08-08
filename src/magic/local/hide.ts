import { Incantation, LOCAL, IncantationError } from "../incantation";


export class HideIncantation extends Incantation<LOCAL, null>
{
  override readonly identifier = "hide"

  apply(target: Desmos.ExpressionState)
  {
    if (target.type !== "expression") {
      throw new IncantationError(`/hidden can only be applied to LaTeX expressions, but target has type: ${target.type}`);
    }

    target.hidden = true;
  }
}
