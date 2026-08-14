import { Incantation, type LOCAL } from "../incantation";


export class NoLineIncantation extends Incantation<LOCAL>
{
  override readonly description
    = "Disable rendering lines for a block."
  
  override readonly identifier = "no-line"

  override apply(target: Desmos.ExpressionState)
  {
    super.require_expr_type(target.type, "expression");
    target.lines = false;
  }
}
