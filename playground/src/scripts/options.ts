import { persisted } from "svelte-persisted-store";

import type { DesmostOptions } from "desmost";
import { fill_defaults } from "desmost/internal";


const DEFAULTS = fill_defaults({});


/** Currently set compiler options. */
export const options = persisted<DesmostOptions>(
  "desmost.playground.options",
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
