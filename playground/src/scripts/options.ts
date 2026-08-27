import { persisted } from "svelte-persisted-store";

import type { DesmostOptions } from "desmost";
import { DEFAULT_OPTIONS } from "../../../desmost/src/index.internal";


/** Currently set compiler options. */
export const options = persisted<DesmostOptions>(
  "desmost.playground.options",
  DEFAULT_OPTIONS,
  {
    serializer: {
      stringify: JSON.stringify,

      parse: raw => {
        let data = JSON.parse(raw);

        for (let [key, value] of Object.entries(DEFAULT_OPTIONS)) {
          if (!Object.hasOwn(data, key) || data[key] == undefined) {
            data[key] = value;
          }
        }

        return data;
      }
    }
  }
);
