/**
 * Prettify `source` to render nicely as source code.
 * 
 * This cleans up messy LaTeX:
 * 
 * - Replace `\left(\right)` with `()`.
 * 
 * This is the inverse of `prettify_latex()`, satisfying:
 * 
 * ```ts
 * prettify_source(prettify_latex(x)) === x
 * ```
 */
export function prettify_source(source: string): string
{
   source = source.replaceAll(/(?<=[^ ])=(?=[^ ])/g, " = ");
   source = source.replaceAll(/\\left\s*(\(|\[|\\\{)/g, "$1");
   source = source.replaceAll(/\\right\s*(\)|\]|\\\})/g, "$1");
	source = source.replaceAll(/(:|,)\\ /g, "$1 ");

	source = source.replaceAll(
      /\\operatorname\{(length|mean|median|count|total|repeat|join|sort|shuffle|unique|mod|ceil|floor|round|sign)\}\s*(?=\(|\\left\()/g,
		"$1"
	);
   source = source.replaceAll(
		/\\(min|max)\s*(?=\(|\\left\()/g,
		"$1"
	);
	source = source.replaceAll(
		/\\operatorname\{(and|or)\}/g,
		"$1",
	);

   return source;
}
