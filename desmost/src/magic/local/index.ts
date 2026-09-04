import { Incantation, type LOCAL } from "../incantation";

import { anim    } from "./anim";
import { colour  } from "./colour";
import { dashed  } from "./dashed";
import { fill    } from "./fill";
import { hide    } from "./hide";
import { label   } from "./label";
import { line    } from "./line";
import { no_line } from "./no-line";
import { point   } from "./point";
import { secret  } from "./secret";
import { slider  } from "./slider";


export const LOCAL_INCANTATIONS = {
	anim,
	colour,
	dashed,
	fill,
	hide,
	label,
	line,
	no_line,
	point,
	secret,
	slider,
} satisfies Record<string, Incantation<LOCAL>>;
