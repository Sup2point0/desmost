/**
 * Is `expr` a Desmos LaTeX expression (as opposed to a note or table)?
 */
export function is_latex(expr: Desmos.ExpressionState): expr is Desmos.Expression
{
	return (expr.type === undefined || expr.type === "expression");
}
