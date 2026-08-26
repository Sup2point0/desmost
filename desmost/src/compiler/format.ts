import dedent from "dedent";

import type { DesmostOptions } from "./options";

import { UnrecoverableError } from "../errors";


export function format_error(
	e: UnrecoverableError,
	options: DesmostOptions,
): string
{
	let prefix = options.error_prefix;
	let sep = (prefix === "" || prefix.endsWith("\n")) ? "" : " ";

	// TODO maybe include stack? (configurable?)
	let display = `${prefix}${sep}${e.name}: ${e.message}`;

	if (e.details != undefined && options.expand_errors) {
		display += "\n";

		if (e.details.hint != undefined) {
			display += `\nHint: ${e.details.hint}`;
		}
		if (e.details.flagged_by != undefined) {
			display += `\n\n[Flagged by: \`${e.details.flagged_by}\`]`;
		}
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
