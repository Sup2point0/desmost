import { Incantation, type GLOBAL } from "../incantation";

import { desmos   } from "./desmos";
import { viewport } from "./viewport";
import { dark     } from "./dark";


export const GLOBAL_INCANTATIONS = {
	desmos,
	viewport,
	dark,
} satisfies Record<string, Incantation<GLOBAL>>;
