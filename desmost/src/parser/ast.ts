import { DesmostError } from "../errors";
import { Incantation, ArgIncantation } from "../magic";


export namespace Ast
{
	/** What kind of AST node this is. */
	export enum Kind
	{
		EXPRESSION             = "Expression",
		INCANTATION_INVOCATION = "Incantation-Invocation",
	}

	
	/** A Desmos expression to add to the calculator. */
	export interface Expression
	{
		kind: Kind.EXPRESSION
		data: Desmos.ExpressionState
		incantations: IncantationInvocation<Incantation.Effect.LOCAL>[]
	}


	/** A pending incantation invocation that requires applying its argument (if any), then applying its effect. */
	export type IncantationInvocation<Effect extends Incantation.Effect = Incantation.Effect> =
		| {
			kind: Kind.INCANTATION_INVOCATION
			incantation: Incantation<Effect>
		}
		| {
			kind: Kind.INCANTATION_INVOCATION
			incantation: ArgIncantation<Effect>
			arg_raw: string | undefined
		};
}

/** An abstract object produced by the parser. */
export type Ast =
	| Ast.Expression
	| Ast.IncantationInvocation
;
