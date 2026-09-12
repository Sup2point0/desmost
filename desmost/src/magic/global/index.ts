import { Incantation, type GLOBAL } from "../incantation";

import { desmos    } from "./desmos";
import { viewport  } from "./viewport";
import { dark      } from "./dark";
import { no_border } from "./no-border";


export const GLOBAL_INCANTATIONS = {
	desmos,
	viewport,
	dark,
	no_border,
} satisfies Record<string, Incantation<GLOBAL>>;
