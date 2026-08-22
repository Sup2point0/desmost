import { UnrecoverableError } from "../errors";
import { Incantation, ArgIncantation } from "../magic";


export namespace Ast
{
	/** What kind of AST node this is. */
	export enum Kind
	{
		EXPRESSION             = "Expression",
		INCANTATION_INVOCATION = "Incantation-Invocation",
		INVALID_INCANTATION    = "Invalid-Incantation",
	}

	
	/** A Desmos expression to add to the calculator. */
	export interface Expression
	{
		kind: Kind.EXPRESSION
		data: Desmos.ExpressionState
		incantations: Array<
			| IncantationInvocation<Incantation.Effect.LOCAL>
			| InvalidInvocation
			>
	}


	/** A pending incantation invocation that requires applying its argument (if any), then applying its effect. */
	export type IncantationInvocation<Effect extends Incantation.Effect = Incantation.Effect> =
		| {
			kind: Kind.INCANTATION_INVOCATION
			incantation: Incantation<Effect>
			arg_raw: undefined
		}
		| {
			kind: Kind.INCANTATION_INVOCATION
			incantation: ArgIncantation<Effect>
			arg_raw: string | undefined
		};

	/**
	 * An invalid invantation invocation that raised an error when parsed.
	 * 
	 * This will be propogated to the user as an extra Desmos text expression (unless they have `errors: "suppress"` configured).
	 */
	export interface InvalidInvocation
	{
		kind: Kind.INVALID_INCANTATION
		incantation: Incantation
		arg_raw?: string
		error: UnrecoverableError
	}
}

/** An abstract object produced by the parser. */
export type Ast =
	| Ast.Expression
	| Ast.IncantationInvocation
	| Ast.InvalidInvocation
;
