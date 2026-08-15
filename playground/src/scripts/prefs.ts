import { persisted } from "svelte-persisted-store";


export const prefs = persisted("desmost.playground.prefs", {
  /** Is the compiler options panel open? */
  options: false,

  /** Are the debug panels open? */
  debug: false,

  frac_x: 0.5,

  frac_y: 0.6,
});
