import { Incantation, type LOCAL } from "../incantation";

import { ColourIncantation } from "./colour";
import { DashedIncantation } from "./dashed";
import { FillIncantation } from "./fill";
import { HideIncantation } from "./hide";
import { NoLineIncantation } from "./no-line";
import { PointIncantation } from "./point";
import { SecretIncantation } from "./secret";
import { SliderIncantation } from "./slider";


export const LOCAL_INCANTATIONS: Incantation<LOCAL>[] =
[
  new ColourIncantation(),
  new DashedIncantation(),
  new FillIncantation(),
  new HideIncantation(),
  new NoLineIncantation(),
  new PointIncantation(),
  new SecretIncantation(),
  new SliderIncantation(),
];
