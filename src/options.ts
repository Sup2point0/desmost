/** Options to customise Desmost compilation. */
export interface DesmostOptions
{
  /** Should errors be surfaced at all?
   * 
   * Defaults to `true`.
   */
  show_errors?: boolean;

  /**
   * Where should errors be placed?
   * 
   * - `inline`: Alongside or in place of the expression that produced it
   * - `end`: All aggregated at the end of the Desmos expressions list
   * - `start`: All aggregated at the start of the Desmos expressions list
   */
  place_errors?: "inline" | "end" | "start";
}
