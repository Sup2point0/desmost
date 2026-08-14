import { Incantation, type LOCAL } from "../incantation";


export class NoLineIncantation extends Incantation<LOCAL>
{
  override readonly description
    = "Disable rendering lines for a block."
  
  override readonly identifier = "no-line"

  override apply(target: Desmos.ExpressionState)
  {
    // @ts-expect-error: outdated types
    target.lines = false;
  }
}
