import { Incantation, type LOCAL } from "../incantation";

import { ColourIncantation } from "./colour";
import { FillIncantation } from "./fill";
import { HideIncantation } from "./hide";
import { NoLineIncantation } from "./no-line";
import { SecretIncantation } from "./secret";
import { SliderIncantation } from "./slider";


export const LOCAL_INCANTATIONS: Incantation<LOCAL>[] =
[
  new ColourIncantation(),
  new FillIncantation(),
  new HideIncantation(),
  new NoLineIncantation(),
  new SecretIncantation(),
  new SliderIncantation(),
];
