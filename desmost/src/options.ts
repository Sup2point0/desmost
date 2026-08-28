import { LINE } from "./utils";
import { compile } from "./compiler/compile";


/** Default options that Desmost uses for `compile()` and `decompile()`. */
export const DEFAULT_OPTIONS: DesmostOptions =
{
   errors: "surface",
   place_errors: "inline",
   error_prefix: `[DESMOST ERROR]\n${LINE}\n`,
	expand_errors: true,
   prettify: true,
	dedent_text: true,
	check_args: false,
   ignore_comments: false,
   ignore_all_blanks: false,
   keep_leading_blanks: false,
   keep_trailing_blanks: false,
   debug: false,
};


/**
 * Fill in `options` with Desmost's defaults to produce a complete `DesmostOptions` config.
 */
export function fill_defaults(options: Partial<DesmostOptions> | undefined): DesmostOptions
{
   return {
      ...DEFAULT_OPTIONS,
      ...options,
   };
}


/**
 * Options to customise Desmost compilation.
 * 
 * To customise compilation, pass in a `DesmostOptions` object as the last argument to {@linkcode compile()}:
 * 
 * ```ts
 * compile(calc, source, { errors: "crash" });
 * ```
 * 
 * ## Decompilation
 * 
 * The same options can also be applied to decompilation:
 * 
 * ```ts
 * decompile(calc, blank, { prettify: false });
 * ```
 * 
 * Here, this means “decompile into source code that would reproduce `calc`, *when compiled with these options*”. As an identity:
 * 
 * ```ts
 * let options = { ... };
 * compile(_, decompile(calc, _ options), options) == calc  // (value equality)
 * ```
 */
export interface DesmostOptions
{
	/**
	 * How should errors be displayed?
	 * 
	 * - `surface` (default): Blocks that result in errors will become Desmos text blocks containing the error message, leaving other expressions unaffected.
	 * 
	 * - `crash`: The entire compilation to Desmos will terminate with a single error message in a text block.
	 *   - This means you don't get any Desmos rendering at all, but errors are also immediately obvious.
	 *    - Note that this will *clear all expressions* in the calculator instance. If you pass in a non-blank `Desmos.Calculator` to `compile()`, it could get cleared.
	 * 
	 * - `suppress`: Silently fail on the frontend (if you wish to give the illusion that everything is fine!).
	 */
	errors: "surface" | "crash" | "suppress"

	/**
	 * Where should errors be placed?
	 * 
	 * - `inline` (default): Alongside or in place of the expression that produced it.
	 * - `end`: All aggregated at the end of the Desmos expressions list.
	 * - `start`: All aggregated at the start of the Desmos expressions list.
	 */
	place_errors: "inline" | "end" | "start"

	/**
	 * The prefix to prepend to error blocks.
	 * 
	 * Defaults to `"[DESMOST ERROR]"`.
	 * 
	 * Provide a `""` blank string if you wish for no prefix to be added.
	 */
	error_prefix: string

	/**
	 * Show all the available diagnostics for errors, including hints and debug information?
	 * 
	 * Defaults to `true` – all output is shown.
	 */
	expand_errors: boolean

	/**
	 * Error if an incantation receives a `{}` object argument with unknown fields, or no fields at all?
	 * 
	 * For instance, `/label{position: LEFT}` is invalid; it should be `/label{pos: LEFT}`. With `check_args: false`, this silently no-ops.
	 * 
	 * Desmost doesn’t remove unknown fields, it just passes them directly to the Desmos API. If you know what you’re doing and a field you know exists isn’t supported by Desmos, you can disable this to avoid erroring.
	 * 
	 * Defaults to `true` – arguments are checked. The Desmos API happily accepts and ignores invalid fields, so Desmost provides a safety net for you ;)
	 */
	check_args: boolean

	/**
	 * Prettify LaTeX output so it renders nicely in the Desmos editor?
	 * 
	 * This means you can keep your source code much neater. It handles stuff like converting `()` –> `\left(\right)`, `x, y` –> `x,\ y`, `min(x, y)` –> `\operatorname{min}\left(x,\ y\right)`, and more!
	 * 
	 * Defaults to `true` – LaTeX is prettified.
	 */
	prettify: boolean

	/**
	 * Strip common indentation from `/text{}` blocks?
	 * 
	 * This allows you to indent content for readability:
	 * 
	 * ```hs
	 * /text{
	 *   Now I have
	 *   a lovely indent
	 * }
	 * ```
	 * 
	 * Defaults to `true` – text is dedented.
	 */
	dedent_text: boolean

	/**
	 * Should `%` LaTeX comments be ignored, instead of turned into text blocks (notes)?
	 * 
	 * ```hs
	 * % Do I become a text expression?
	 * y = x
	 * ```
	 * 
	 * Defaults to `false` – comments are kept.
	 */
	ignore_comments: boolean

	/**
	 * Should all line breaks be ignored, instead of kept as blank expressions?
	 * 
	 * ```hs
	 * % Should there be a blank block after this?
	 * 
	 * % Should there be a blank block before this?
	 * ```
	 * 
	 * This takes precedence over `keep_leading_blanks` and `keep_trailing_blanks`.
	 * 
	 * Defaults to `false` – blank lines are recognised.
	 */
	ignore_all_blanks: boolean

	/**
	 * Should trailing blank lines at the start of the source be kept as blank expressions?
	 * 
	 * This is disabled by default so line breaks after global incantations don’t mess things up:
	 * 
	 * ```hs
	 * /viewport{left: -8, right: 8}
	 * 
	 * % I don’t have a blank block above me, yay
	 * ```
	 * 
	 * Defaults to `false` – leading blank lines are ignored.
	 */
	keep_leading_blanks: boolean

	/**
	 * Should trailing blank lines at the end of the source be kept as blank expressions?
	 * 
	 * Defaults to `false` – trailing blank lines are ignored.
	 */
	keep_trailing_blanks: boolean

	/**
	 * Return debug diagnostics from `compile()`?
	 * 
	 * This includes the unevaluated AST and performance diagnostics. Relevant types are exposed from `desmost/internal`, but beware that these are implementation details and unstable.
	 * 
	 * Defaults to `false` – `compile()` returns `void`.
	 */
	debug: boolean
}
