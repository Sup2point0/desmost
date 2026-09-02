import { DesmostCompiler, type DesmostDebug } from "./compiler";

import { type DesmostOptions, fill_defaults } from "../options";


/**
 * Compile Desmost into Desmos.
 * 
 * This calls the Desmost compiler: parsing and evaluating `source`, then injecting the results into an existing `desmos` instance. Pass in `options` to customise compilation.
 * 
 * ## Example
 * 
 * ```ts
 * let calc = Desmos.GraphingCalculator();
 * 
 * compile(calc, `/text{ sup world! }`);
 * 
 * compile(calc, `/slider{ error! } :: t = 0`, {
 *   errors: "crash",
 * });
 * ```
 */
export function compile(
	/** The Desmos calculator instance to compile into. */
	desmos: Desmos.Calculator,

	/** The Desmost source code to compile. */
	source: string,

	/**
	 * Compilation options.
	 * 
	 * See {@linkcode DesmostOptions} for the options available.
	*/
	options?: Partial<DesmostOptions>,
): void | DesmostDebug
{
	if (desmos == undefined) {
		console.error(`Desmost: No \`Desmos.Calculator\` instance provided, aborting compilation!`);
		return;
	}

	if (source == undefined) {
		console.error(`Desmost: No source code provided, aborting compilation!`);
		return;
	}

	let compiler = new DesmostCompiler(
		desmos,
		source,
		fill_defaults(options),
	);

	return compiler.compile();
}
