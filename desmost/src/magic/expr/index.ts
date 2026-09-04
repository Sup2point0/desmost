import { ArgIncantation, type EXPR } from "../incantation";

import { LatexIncantation } from "./latex";
import { TextIncantation } from "./text";


export const EXPR_INCANTATIONS =
{
	latex: new LatexIncantation(),
	text:  new TextIncantation(),

} satisfies Record<string, ArgIncantation<EXPR>>;
