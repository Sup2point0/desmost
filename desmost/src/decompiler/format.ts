export const stringify_json5: (typeof JSON.stringify) = (
   data, replacer, space
) =>
{
   return (
      // @ts-expect-error: random `null`??
      JSON.stringify(data, replacer, space)
      .slice(1, -1)  // strip surrounding {}
      .trim()
      .replaceAll(/"([^"]+)":/g, "$1:")  // "key": <value> -> key: <value>
   );
}


export function prettify_source(source: string): string
{
   source = source.replaceAll(/(?<=[^ ])=(?=[^ ])/g, " = ");
   source = source.replaceAll(/\\left\s*(\(|\[|\\\{)/g, "$1");
   source = source.replaceAll(/\\right\s*(\)|\]|\\\})/g, "$1");
	source = source.replaceAll(/(:|,)\\ /g, "$1 ");

   return source;
}
