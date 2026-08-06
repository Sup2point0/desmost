import { Incantation, GLOBAL } from "../incantation";

import { ViewportIncantation } from "./viewport";


export const GLOBAL_INCANTATIONS: Incantation<GLOBAL>[] =
[
  new ViewportIncantation()
];
