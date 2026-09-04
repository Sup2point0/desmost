import { compile } from "../../../src";

import { testing_desmos } from "../../shared";
import { assert_has_errors } from "../shared";


test.each([
	`/hide extra :: y = x`,
	`/colour{BLUE} extra :: y = x`,
	`/line{opacity: 0.5} extra :: y = x`,
	`/line{opacity: 0.5, extra} extra :: y = x`,
])
("excess input", src => {
	let desmos = testing_desmos();
	compile(desmos, src + "\nx");
	assert_has_errors(desmos);

	let exprs = desmos.getExpressions();
	assert.equal(exprs.at(-1)!.latex, `x`);
});

test.each([
	`/viewport\n1`,
	`/colour :: 1\n2`,
	`/colour /no-line :: 1\n2`,
])
("missing input", src => {
	let desmos = testing_desmos();
	compile(desmos, src + "\nx");
	assert_has_errors(desmos);

	let exprs = desmos.getExpressions();
	assert.equal(exprs.at(-1)!.latex, `x`);
});
