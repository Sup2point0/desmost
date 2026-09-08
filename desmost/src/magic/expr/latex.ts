import { Incantation, ArgIncantation, type EXPR } from "../incantation";


class LatexIncantation extends ArgIncantation<EXPR>
{
	override readonly effect       = Incantation.Effect.EXPR
	override readonly identifier   = "latex"
	override readonly requires_arg = true
	override readonly arg_type     = Incantation.ArgType.LATEX
	override readonly description
		= "Produce a LaTeX expression. This allows the input to span multiple lines."

	apply(target: Desmos.ExpressionState, data: string): asserts target is Desmos.Expression
	{
		target.type = "expression";
		// @ts-expect-error: previous assignment type-narrows
		target.latex = data === "" ? " " : data;
	}

	// TODO extract
}

export const latex = new LatexIncantation();
