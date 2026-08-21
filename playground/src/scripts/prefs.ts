import { persisted } from "svelte-persisted-store";


/** The user's playground state, persisted to localStorage. */
interface PlaygroundPrefs
{
  /** Is the compiler options panel open? */
  show_options: boolean;

  frac_x: number;

  frac_y: number;
}

const DEFAULTS: PlaygroundPrefs = {
  show_options: false,
  debug: false,
  frac_x: 0.5,
  frac_y: 0.6,
};

/** The user's playground state, persisted to localStorage. */
export const prefs = persisted(
  "desmost.playground.prefs",
  DEFAULTS,
  {
    serializer: {
      stringify: JSON.stringify,

      parse: raw => {
        let data = JSON.parse(raw);

        for (let [key, value] of Object.entries(DEFAULTS)) {
          if (!Object.hasOwn(data, key) || data[key] == undefined) {
            data[key] = value;
          }
        }

        return data;
      }
    }
  }
);
