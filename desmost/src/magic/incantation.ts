import Json5 from "json5";
import dedent from "dedent";

import type { DesmostOptions } from "../options";
import { DesmostError, type Fallible } from "../errors";


/**
 * An *Incantation* is like a slash command that tells Desmost to do something - like changing the properties of an expression, or applying some settings to the calculator as a whole.
 * 
 * Incantations must be prefixed by a `/`. They look like this:
 * 
 * ```math
 * /viewport{ left: -1, right: 1 }
 * /hidden :: x = 69
 * /text :: Never gonna give you up
 * ```
 * 
 * Incantations that accept an argument derive from `ArgIncantation`.
 */
export abstract class Incantation<
	Effect extends Incantation.Effect = Incantation.Effect
>
{
	/** Short user-facing description of what the incantation does. */
	abstract readonly description: string

	/** The raw text sequence that matches this incantation, such as `viewport` or `hidden`. */
	abstract readonly identifier: string

	/** An alternative `.identifier`, strictly for localisation purposes only. */
	readonly alias?: string


	/** Apply this incantation's effect to `target`, using the provided `data` if required. */
	abstract apply(
		target: Effect extends GLOBAL ? Desmos.Calculator : Desmos.ExpressionState,
		data?: unknown,
	): void

	/** Error if the `actual` type of the given expression is not `required`. */
	protected require_expr_type<T extends Desmos.ExpressionState["type"]>(
		actual: unknown,
		required: T,
	): asserts actual is T
	{
		if ((actual ?? "expression") !== required)
		{
			let req = required === "expression" ? "latex" : required;

			throw new DesmostError.IllegalIncantation({
				msg: `/${this.identifier} can only applied to \`${req}\` blocks, but target block has type: \`${actual}\``,
			});
		}
	}
}


/**
 * An incantation that accepts an argument.
 */
export abstract class ArgIncantation<
	Effect extends Incantation.Effect = Incantation.Effect
>
	extends Incantation<Effect>
{
	/** Does this incantation always require an argument to be passed? */
	readonly requires_arg: boolean = true

	/** What type of argument does this incantation accept? */
	abstract readonly arg_type: Incantation.ArgType


	/**
	 * Evaluate the argument provided to this incantation, throwing if an error is encountered.
	 * 
	 * For instance, for `/viewport{ left: -1, right: 1 }`, this returns the POJO `{ left: -1, right: 1 }`.
	 * 
	 * ## Notes
	 * 
	 * Child incantation classes should override this method, though the defaults should cover most cases (except `ArgType.ENUM`).
	 * 
	 * Validity checks for missing or invalid values, incorrect types, and unknown fields should be performed here, so that `.apply()` can assume the data it receives is guaranteed to be valid.
	 */
	evaluate_arg(raw: string, options: DesmostOptions): Fallible<unknown>
	{
		switch (this.arg_type) {
			case Incantation.ArgType.LATEX:  return raw;
			case Incantation.ArgType.ENUM:   return raw;
			
			case Incantation.ArgType.STRING:
				return (options.dedent_text) ? dedent(raw): raw.trim();
			
			case Incantation.ArgType.OBJECT: {
				try {
					return Json5.parse(`{${raw}}`);
				}
				catch (e) {
					// @ts-expect-error: fine
					throw new DesmostError.InvalidArgument({ msg: e.message });
				}
			}
		}
	}

	protected require_nonempty(
		arg: object,
		error_data?: DesmostError.Data,
	): Fallible<void>
	{
		if (Object.entries(arg).length === 0) {
			throw new DesmostError.MissingInput({
				msg: `/${this.identifier} received an empty argument {}`,
				...error_data
			});
		}
	}

	protected require_known(
		arg: object,
		valid_fields: string[],
		error_data?: DesmostError.Data,
	): Fallible<void>
	{
		// TODO accumulate
		for (let field of Object.keys(arg)) {
			if (!valid_fields.includes(field)) {
				throw new DesmostError.InvalidArgument({
					msg:  `/${this.identifier} received invalid field: ${field}`,
					hint: `Valid fields are [${valid_fields.join(", ")}]`,
					...error_data,
				});
			}
		}
	}
}


/** An incantation that affects the entire Desmos calculator state, like `/desmos` or `/viewport`. */
export type GLOBAL = Incantation.Effect.GLOBAL;

/** An incantation that affects only the expression immediately following it, like `/hide` or `/slider`. */
export type LOCAL = Incantation.Effect.LOCAL;

/** An incantation that produces an expression, like `/latex` or `/text`. */
export type EXPR = Incantation.Effect.EXPR;


export namespace Incantation
{
	/** The kind of effect an incantation produces - it either modifies only one block, or modifies the calculator as a whole. */
	export enum Effect
	{
		/** An incantation that affects the entire Desmos calculator state, like `/desmos` or `/viewport`. */
		GLOBAL,

		/** An incantation that affects only the expression immediately following it, like `/hide` or `/slider`. */
		LOCAL,
		
		/** An incantation that produces an expression, like `/latex` or `/text`. */
		EXPR,
	}

	/** The type of argument an incantation accepts, which affects how it is parsed. */
	export enum ArgType
	{
		/** Any arbitrary user text content, where characters like `"` and `'` don't have semantic meaning and can be ignored. */
		STRING = "String",

		/** LaTeX, which should have balanced `{}` braces. */
		LATEX = "LaTeX",

		/** Specific value from an allowed set of values, which will map to an enum value in the Desmos API. */
		ENUM = "Enum",

		/** JavaScript object fields, where characters like `{}` and `"` all have semantic meaning, and must be balanced. */
		OBJECT = "Object",
	}
}
