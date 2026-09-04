import { compile } from "../../../src";
import { is_expr } from "../../parsing/shared";

import { testing_desmos } from "../../shared";


test.each([
	"ABOVE", "BELOW", "LEFT", "RIGHT",
	"ABOVE_LEFT", "ABOVE_RIGHT", "BELOW_LEFT", "BELOW_RIGHT",
])
("pos", pos => {
	let desmos = testing_desmos();
	compile(desmos, `/label{text: "sup", pos: ${pos}} :: x`);

	let exprs = desmos.getExpressions();
	
	assert.equal(exprs[0].latex, `x`);
	assert.equal(exprs[0].label, `sup`);
	assert.equal(exprs[0].labelOrientation, pos);
});
