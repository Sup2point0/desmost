import { Incantation, type LOCAL } from "../incantation";


export class AnimIncantation extends Incantation<LOCAL>
{
  override readonly description
    = "Animate the slider of a block."
  
  override readonly identifier = "anim"

  override apply(target: Desmos.ExpressionState)
  {
    super.require_expr_type(target.type, "expression");
    // @ts-expect-error: outdated types
    target.playing = true;
  }
}
