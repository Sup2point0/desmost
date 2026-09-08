import { ArgIncantation, type EXPR } from "../incantation";

import { latex } from "./latex";
import { text  } from "./text";


export const EXPR_INCANTATIONS = {
	latex,
	text,
} satisfies Record<string, ArgIncantation<EXPR>>;
