import { DesmostParser } from "../../src/parser"

import { HideIncantation } from "../../src/magic/local/hide";


describe("parse-pre-sep", () =>
{
	"1 global without arg"

	"1 global without args"

	test("1 local without arg", () => {
		let parser = new DesmostParser(`/hide`);
		let r = parser.parse_pre_sep();

		assert.isDefined(r.locals);
		assert.equal(r.locals.length, 1);
		assert.deepEqual(r.locals[0].incantation, new HideIncantation);
		assert.isUndefined(r.locals[0].arg_raw);
	})

	"1 local with arg"
	
	"many locals without arg"

	"many locals with arg"
})
