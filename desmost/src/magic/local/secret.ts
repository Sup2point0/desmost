import { Incantation, type LOCAL } from "../incantation";

import { Ast } from "../../parser";


export class SecretIncantation extends Incantation<LOCAL>
{
	override readonly description
		= "Turn a block into a secret expression, which is hidden from the end user."
	
	override readonly identifier = "secret"

	override apply(target: Desmos.ExpressionState)
	{
		super.require_expr_type(target.type, "expression");
		target.secret = true;
	}
		
	override extract(target: Desmos.Expression): Ast.IncantationInvocation<LOCAL> | void
	{
		if (target.secret) {
			return {
				kind: Ast.Kind.INCANTATION_INVOCATION,
				incantation: secret,
			};
		}
	}
}

export const secret = new SecretIncantation();
