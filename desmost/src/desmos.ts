/**
 * The Desmos API (currently) is browser-only, so we polyfill the API objects we need here for the server-side.
 */

export enum DesmosColour
{
	RED    = "#c74440",
	BLUE   = "#2d70b3",
	GREEN  = "#388c46",
	PURPLE = "#6042a6",
	ORANGE = "#fa7e19",
	BLACK  = "#000000",
}


/**
 * Is `expr` a Desmos LaTeX expression (as opposed to a note or table)?
 */
export function is_latex(expr: Desmos.ExpressionState): expr is Desmos.Expression
{
	return (expr.type === undefined || expr.type === "expression");
}
