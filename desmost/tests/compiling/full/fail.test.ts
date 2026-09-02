import { compile } from "../../../src";

import { testing_desmos } from "../../shared";
import { assert_has_errors } from "../shared";


test.each([
	`/desmos{`,
	`/desmos}`,
	`/viewport`,
	`/line y = x`,
	`/line :: y = x`,
	`/line{ opacity: 1 } y = x`,
	`/text{ This didn't stop`,
])
("syntax error", src => {
	let desmos = testing_desmos();
	compile(desmos, src);
	assert_has_errors(desmos);
});
