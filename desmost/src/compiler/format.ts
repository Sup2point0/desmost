import type { DesmostOptions } from "../options";

import { DesmostError } from "../errors";
import { LINE } from "../utils";


export function format_error(
	e: DesmostError,
	options: DesmostOptions,
): string
{
	let prefix = options.error_prefix;
	let sep = (prefix === "" || prefix.endsWith("\n")) ? "" : " ";

	// TODO maybe include stack? (configurable?)
	let display = `${prefix}${sep}${e.name}: ${e.message}`;

	if (e.data != undefined && options.expand_errors) {
		display += `\n${LINE}`;

		if (e.data.while != undefined) display += `\nWhile: ${e.data.while}`;
		if (e.data.hint  != undefined) display += `\nHint: ${e.data.hint}`;
		if (e.data.note  != undefined) display += `\n${LINE}\nNote: ${e.data.note}`;
	}

	return display;
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
	latex = latex.replaceAll(/(?:\\left\s?)+/g, "\\left");
	latex = latex.replaceAll(/(?<!\\right)(\)|\]|\\\})/g, "\\right$1");
	latex = latex.replaceAll(/(?:\\right\s?)+/g, "\\right");
	latex = latex.replaceAll(/(:|,)(?!\\ ) */g, "$1\\ ");

	latex = latex.replaceAll(
		/(?<=[^\w]|^)\\?(length|mean|median|count|total|repeat|join|sort|shuffle|unique|mod|ceil|floor|round|sign) ?(?=\(|\\left\()/g,
		"\\operatorname{$1}"
	);

	latex = latex.replaceAll(
		/\s(and|or)\s/g,
		"\\operatorname{$1}"
	);

	return latex;
}
