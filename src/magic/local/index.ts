import { Incantation, LOCAL } from "../incantation";

import { HideIncantation } from "./hide";
import { SliderIncantation } from "./slider";


export const LOCAL_INCANTATIONS: Incantation<LOCAL>[] =
[
  new HideIncantation(),
  new SliderIncantation(),
];
