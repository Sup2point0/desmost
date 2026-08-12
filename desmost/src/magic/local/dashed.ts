import { Incantation, type LOCAL } from "../incantation";

import { UnrecoverableError } from "../../errors";


export class DashedIncantation extends Incantation<LOCAL>
{
  override readonly identifier = "dashed"

  override apply(target: Desmos.ExpressionState)
  {
    super.require_expr_type(target.type, "expression");
    target.lineStyle = Desmos.Styles.DASHED;
  }
}
