import { Incantation, type LOCAL } from "../incantation";


export class SecretIncantation
  extends Incantation<LOCAL>
{
  override readonly identifier = "secret"

  override apply(target: Desmos.ExpressionState)
  {
    // @ts-expect-error: outdated types
    target.secret = true;
  }
}
