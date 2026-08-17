/**
 * Implements incantations logic.
 * 
 * Incantations are represented with `Incantation` and `ArgIncantation` objects. Individual incantations derive from one of these classes, defining their own evaluation and application logic.
 * 
 * Defined incantations are listed under `*_INCANTATIONS` lists.
 */

export { Incantation, ArgIncantation } from "./incantation";
export type { GLOBAL, LOCAL, EXPR } from "./incantation";

export { GLOBAL_INCANTATIONS } from "./global";
export { LOCAL_INCANTATIONS } from "./local";
export { EXPR_INCANTATIONS } from "./expr";
