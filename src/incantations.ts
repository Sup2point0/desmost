export namespace Incantation
{
  export enum EffectKind
  {
    /** An incantation that affects the entire Desmos calculator state. */
    GLOBAL,

    /** An incantation that affects only the expression immediately following it. */
    LOCAL,
  }

  export enum DataKind
  {
    NONE,
    OPTIONAL,
    REQUIRED,
  }
}


/**
 * An *Incantation* is like a slash command that tells <> to do something - like changing the properties of an expression, or applying some settings to the calculator as a whole.
 * 
 * Incantations must appear at the start of lines, prefixed by a `/`. They look like this:
 * 
 * ```math
 * /viewport{ left: -1, right: 1 }
 * /hidden :: x = 69
 * /text :: Never gonna give you up
 * ```
 */
export interface Incantation
{
  identifier: string

  effect_kind: Incantation.EffectKind

  data_kind: Incantation.DataKind
}


export const INCANTATIONS: Incantation[] =
[
  {
    identifier: "viewport",
    effect_kind: Incantation.EffectKind.GLOBAL,
    data_kind: Incantation.DataKind.REQUIRED,
  }
];
