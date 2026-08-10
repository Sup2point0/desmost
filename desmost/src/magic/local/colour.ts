import { Incantation, ArgIncantation, type LOCAL } from "../incantation";
import { UnrecoverableError } from "../../errors";

import { DesmosColour } from "../../desmos";


export class ColourIncantation
  extends ArgIncantation<LOCAL, DesmosColour>
{
  override readonly identifier   = "color"
  override readonly alias        = "colour"
  override readonly requires_arg = true
  override readonly arg_type     = Incantation.ArgType.ENUM

  override apply(target: Desmos.ExpressionState, data: DesmosColour)
  {
    // @ts-expect-error: outdated types
    target.color = data;
  }

  override evaluate_arg(data: string): DesmosColour
  {
    switch (data.trim()) {
      case "RED":    return DesmosColour.RED;
      case "BLUE":   return DesmosColour.BLUE;
      case "GREEN":  return DesmosColour.GREEN;
      case "PURPLE": return DesmosColour.PURPLE;
      case "ORANGE": return DesmosColour.ORANGE;
      case "BLACK":  return DesmosColour.BLACK;
      default:
        throw new UnrecoverableError(
          `Invalid colour: ${data}`
        );
    }
  }
}
