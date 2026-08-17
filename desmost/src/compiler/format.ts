import type { DesmostOptions } from "./options";

import { UnrecoverableError } from "../errors";


export function format_error(
  e: UnrecoverableError,
  options: Required<DesmostOptions>,
): string
{
  let prefix = options.error_prefix;
  let sep = (prefix === "" || prefix.endsWith("\n")) ? "" : " ";

  return `${prefix}${sep}${e.name}: ${e.message}`;
  // TODO maybe include stack? (configurable?)
}
