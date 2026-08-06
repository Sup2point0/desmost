import { Incantation, GLOBAL } from "../incantation";

import { DarkModeIncantation } from "./dark-mode";
import { ViewportIncantation } from "./viewport";


export const GLOBAL_INCANTATIONS: Incantation<GLOBAL>[] =
[
  new DarkModeIncantation(),
  new ViewportIncantation(),
];
