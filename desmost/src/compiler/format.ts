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


/**
 * Remove line breaks from `latex` so Desmos can properly consume it.
 */
export function normalise_latex(latex: string): string
{
	latex = latex.replaceAll(/\s+/g, " ");
	return latex;
}


/**
 * Prettify `latex` to render nicely in Desmos, reflecting how you would type directly into Desmos.
 * 
 * This includes:
 * 
 * - Replace `()`, `[]`, etc. with `\left(\right)`
 * - Replace `min()`, `max()`, etc. with `\operatorname{min}()`
 */
export function prettify_latex(latex: string): string
{
	latex = latex.replaceAll(/(?<!\\left)(\(|\[|\\\{)/g, "\\left$1");
	latex = latex.replaceAll(/(?<!\\right)(\)|\]|\\\})/g, "\\right$1");
	latex = latex.replaceAll(/(:|,)(?!\\ ) */g, "$1\\ ");

	latex = latex.replaceAll(
		/(?<=[^\w]|^)\\?(mean|median|count|total|repeat|join|sort|shuffle|unique|mod|ceil|floor|round|sign) ?(?=\(|\\left\()/g,
		"\\operatorname{$1}"
	);

	return latex;
}
