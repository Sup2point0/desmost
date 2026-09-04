export { DesmosIncantation } from "./desmos";
export { ViewportIncantation } from "./viewport";
export { DarkModeIncantation } from "./dark-mode";


import { Incantation, type GLOBAL } from "../incantation";

import { DesmosIncantation } from "./desmos";
import { ViewportIncantation } from "./viewport";
import { DarkModeIncantation } from "./dark-mode";


export const GLOBAL_INCANTATIONS =
{
	desmos:   new DesmosIncantation(),
	viewport: new ViewportIncantation(),
	dark:     new DarkModeIncantation(),

} satisfies Record<string, Incantation<GLOBAL>>;
