export function prettify_source(source: string): string
{
   source = source.replaceAll(/(?<=[^ ])=(?=[^ ])/g, " = ");
   source = source.replaceAll(/\\left\s*(\(|\[|\\\{)/g, "$1");
   source = source.replaceAll(/\\right\s*(\)|\]|\\\})/g, "$1");
	source = source.replaceAll(/(:|,)\\ /g, "$1 ");

   return source;
}
