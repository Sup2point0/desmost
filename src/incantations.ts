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
 * An incantation, backed by its identifier (such as `viewport` or `hidden`).
 */
export type Incantation =
  | GlobalIncantation
  | LocalIncantation
;


export const ALL_INCANTATION_IDENTIFIERS = [
  ...Object.values(GlobalIncantation),
  ...Object.values(LocalIncantation),
];
