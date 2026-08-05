/**
 * An incantation that affects the entire Desmos calculator state.
 */
export enum GlobalIncantation
{
  VIEWPORT = "viewport",
}


/**
 * An incantation that affects only the expression following it.
 */
export enum LocalIncantation
{
  HIDDEN = "hidden",
}


/**
 * An incantation, backed by its raw text representation.
 * 
 * Incantations are invoked by a slash at the start of a line, such as `/viewport` or `/hidden`.
 */
export type Incantation =
  | GlobalIncantation
  | LocalIncantation
;
