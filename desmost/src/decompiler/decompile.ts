import { emit_global_incantation, emit_expression } from "./emit";

import type { Ast } from "../parser";


/**
 * Decompile Desmos into raw Desmost source code.
 */
export function decompile(desmos: Desmos.Calculator): string
{
  let { settings, viewport, exprs } = structured_decompile(desmos);
  
  return `${
    emit_global_incantation(settings)
  }${
    emit_global_incantation(viewport)
  }${
    exprs.map(emit_expression).join("\n")
  }`;
}


export function structured_decompile(desmos: Desmos.Calculator): DesmostDecompile
{
  // TODO
}


export interface DesmostDecompile
{
  /** The `/desmos` global incantation. */
  settings?: Ast.IncantationInvocation;

  /** The `/viewport` global incantation. */
  viewport?: Ast.IncantationInvocation;

  /** Expressions from the Desmos editor. */
  exprs: Ast.Expression[];
}
