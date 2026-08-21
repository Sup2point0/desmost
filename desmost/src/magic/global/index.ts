export { DesmosIncantation } from "./desmos";
export { ViewportIncantation } from "./viewport";
export { DarkModeIncantation } from "./dark-mode";


import { Incantation, type GLOBAL } from "../incantation";

import { DesmosIncantation } from "./desmos";
import { ViewportIncantation } from "./viewport";
import { DarkModeIncantation } from "./dark-mode";


export const GLOBAL_INCANTATIONS: Incantation<GLOBAL>[] =
[
	new DesmosIncantation(),
	new ViewportIncantation(),
	new DarkModeIncantation(),
];
