import { ArgIncantation, EXPR } from "../incantation";

import { LatexIncantation } from "./latex";
import { TextIncantation } from "./text";


export const EXPR_INCANTATIONS: ArgIncantation<EXPR>[] =
[
  new LatexIncantation(),
  new TextIncantation(),
];
