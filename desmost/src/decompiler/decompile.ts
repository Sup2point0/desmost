import type { Ast } from "../parser";


/**
 * Decompile Desmos into Desmost source code.
 */
export function decompile(desmos: Desmos.Calculator): string
{
  // TODO
  let { desmos, viewport, exprs } = structured_decompile(desmos)
  return 
}


export function structured_decompile(desmos: Desmos.Calculator): DesmostDecompile
{
  // TODO
}


export interface DesmostDecompile
{
  /** The `/desmos` global incantation. */
  desmos: Ast.IncantationInvocation;
}
