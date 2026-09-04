import { Incantation, type LOCAL } from "../incantation";
import { AnimIncantation } from "./anim";

import { ColourIncantation } from "./colour";
import { DashedIncantation } from "./dashed";
import { FillIncantation   } from "./fill";
import { HideIncantation   } from "./hide";
import { LabelIncantation  } from "./label";
import { LineIncantation   } from "./line";
import { NoLineIncantation } from "./no-line";
import { PointIncantation  } from "./point";
import { SecretIncantation } from "./secret";
import { SliderIncantation } from "./slider";


export const LOCAL_INCANTATIONS =
{
	anim:    new AnimIncantation(),
	colour:  new ColourIncantation(),
	dashed:  new DashedIncantation(),
	fill:    new FillIncantation(),
	hide:    new HideIncantation(),
	label:   new LabelIncantation(),
	line:    new LineIncantation(),
	no_line: new NoLineIncantation(),
	point:   new PointIncantation(),
	secret:  new SecretIncantation(),
	slider:  new SliderIncantation(),

} satisfies Record<string, Incantation<LOCAL>>;
