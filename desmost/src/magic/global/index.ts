import { Incantation, type GLOBAL } from "../incantation";

import { desmos   } from "./desmos";
import { viewport } from "./viewport";
import { DarkModeIncantation } from "./dark-mode";


export const GLOBAL_INCANTATIONS =
{
	desmos,
	viewport,
	dark: new DarkModeIncantation(),
} satisfies Record<string, Incantation<GLOBAL>>;
