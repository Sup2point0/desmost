/** Options to customise Desmost compilation. */
export interface DesmostOptions
{
  /**
   * How should errors be *surfaced*?
   * 
   * Errors will always be logged to console for the developer; this setting affects how they visually reach the end user.
   * 
   * - `surface` (default): Blocks that result in errors will become Desmos text expressions containing the error message, leaving other expressions unaffected.
   * - `crash`: The entire compilation to Desmos will terminate with a single error message. This means you don't get any output at all, but errors are also immediately obvious.
   * - `suppress`: Silently fail on the frontend (if you wish to give the illusion that everything is fine).
   */
  errors?: "surface" | "crash" | "suppress"

  /**
   * Where should errors be placed?
   * 
   * - `inline` (default): Alongside or in place of the expression that produced it.
   * - `end`: All aggregated at the end of the Desmos expressions list.
   * - `start`: All aggregated at the start of the Desmos expressions list.
   */
  place_errors?: "inline" | "end" | "start"

  /**
   * Should trailing blank lines be ignored, instead of kept as blank expressions?
   * 
   * Defaults to `false`, meaning blank lines *are* kept.
   */
  clean_trailing_blanks?: boolean

  /**
   * Return debug diagnostics? This includes the unevaluated AST, and performance diagnostics.
   * 
   * Defaults to `false`.
   */
  debug?: boolean
}


/**
 * Fill in `options` with Desmost's defaults to produce a complete `DesmostOptions` config.
 */
export function set_default_options(options: Partial<DesmostOptions> | undefined): Required<DesmostOptions>
{
  options ??= {};
  
  options.errors ??= "surface";
  options.place_errors ??= "inline";
  options.clean_trailing_blanks ??= false;

  options.debug ??= false;

  return options as Required<DesmostOptions>;
}
