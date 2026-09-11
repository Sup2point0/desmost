import { decompile } from "../../../src/decompiler";
import * as utils from "../../../src/utils";

import { ltx, testing_desmos } from "../../shared";
import { EASY } from "../../cases/easy";


test("decompiles", () => {
	let desmos = testing_desmos(
		{ latex: ltx `f\left(0\right) = 0` },
		{ latex: ltx `f\left(1\right) = 1` },
		{ latex: ltx `f\left(n\right) = f\left(n-1\right) + f\left(n\right)` },
		{ latex: ltx ` ` },
		{ latex: ltx `\frac{1}{10} \sum_{n=1}^{10} \frac{f\left(n+1\right)}{f\left(n\right)}` },
	);

	let src = decompile(desmos, testing_desmos());
	let lines = utils.zipping(src.split("\n"), EASY.split("\n"));
	
	for (let [actual, expected] of lines) {
		assert.equal(actual, expected);
	}
});
