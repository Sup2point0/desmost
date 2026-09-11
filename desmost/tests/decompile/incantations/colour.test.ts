import { decompile } from "../../../src/decompiler";
import { testing_desmos } from "../../shared";


test.each([
	"RED", "BLUE", "GREEN", "PURPLE", "ORANGE", "BLACK",
])
("name (%s)", col => {
	let desmos = testing_desmos(
		{ latex: `1`, color: Desmos.Colors[col] },
	);

	let src = decompile(desmos, testing_desmos());
	assert.equal(src, `/colour{${col}} :: 1`);
});

test.each([
	"#ffffff",
	"#ff0000",
	"#ff0090",
])
("hex (%s)", color => {
	let desmos = testing_desmos(
		{ latex: `1`, color },
	);

	let src = decompile(desmos, testing_desmos());
	assert.equal(src, `/colour{${color}} :: 1`);
});
