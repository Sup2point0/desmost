import { Incantation, GLOBAL } from "../incantation";

import { DesmosIncantation } from "./desmos";
import { ViewportIncantation } from "./viewport";
import { DarkModeIncantation } from "./dark-mode";


export const GLOBAL_INCANTATIONS: Incantation<GLOBAL>[] =
[
  new DesmosIncantation(),
  new ViewportIncantation(),
  new DarkModeIncantation(),
];
