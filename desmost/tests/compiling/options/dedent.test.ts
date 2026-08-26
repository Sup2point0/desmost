import { compile } from "../../../src";

import { testing_desmos } from "../../shared";


describe("dedent", () =>
{
	test.each([2, 5, 20, 100])
	("easy", n => {
		const src = `
/text{
${' '.repeat(n)}Sup,
${' '.repeat(n)}World!
}
		`.trim();

		let desmos = testing_desmos();
		compile(desmos, src, { dedent_text: true });

		let exprs = desmos.getExpressions();
		assert.equal(exprs[0].type, "text");
		assert.equal(exprs[0].text, "Sup,\nWorld!");
	});
	
	test("medium", () => {
		const src = `
/text{
  Sup,
    World!
}
		`.trim();

		let desmos = testing_desmos();
		compile(desmos, src, { dedent_text: true });

		let exprs = desmos.getExpressions();
		assert.equal(exprs[0].type, "text");
		assert.equal(exprs[0].text, "Sup,\n  World!");
	});
	
	// FIXME
// 	test.each([2, 5, 20, 100])
// 	("tags", n => {
// 		const src = `
// /text{
// ${'\t'.repeat(n)}Sup,
// ${'\t'.repeat(n)}World!
// }
// 		`.trim();

// 		let desmos = testing_desmos();
// 		compile(desmos, src, { dedent_text: false });

// 		let exprs = desmos.getExpressions();
// 		assert.equal(exprs[0].type, "text");
// 		assert.equal(exprs[0].text, "Sup,\nWorld!");
// 	});
})
